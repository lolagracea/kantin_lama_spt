from fastapi import APIRouter, Depends, HTTPException, Header, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from ..database import get_db
from ..models import MenuItem, Order, OrderItem
from ..schemas import CheckoutPayload, OrderStatusUpdate
from ..background_tasks import process_order_background

router = APIRouter()


def generate_queue_number(db: Session):
    today_order_count = db.query(func.count(Order.id)).scalar() or 0
    next_number = today_order_count + 1
    return f"A-{next_number:03d}"


@router.post("/checkout")
def checkout(
    payload: CheckoutPayload,
    background_tasks: BackgroundTasks,
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
    db: Session = Depends(get_db),
):
    """
    Checkout dengan:
    1. Idempotency key untuk mencegah double order.
    2. with_for_update() untuk mengunci stok.
    3. Transaction rollback jika gagal.
    4. BackgroundTasks untuk proses async.
    """

    existing_order = (
        db.query(Order)
        .filter(Order.idempotency_key == idempotency_key)
        .first()
    )

    if existing_order:
        return {
            "message": "Order sudah pernah dibuat. Mengembalikan order yang sama.",
            "order_id": existing_order.id,
            "queue_number": existing_order.queue_number,
            "total_price": existing_order.total_price,
            "status": existing_order.status,
            "estimated_ready_minutes": existing_order.estimated_ready_minutes,
        }

    if not payload.items:
        raise HTTPException(status_code=400, detail="Item pesanan tidak boleh kosong")

    try:
        total_price = 0
        order_items_data = []

        for item in payload.items:
            if item.quantity <= 0:
                raise HTTPException(status_code=400, detail="Quantity harus lebih dari 0")

            menu = (
                db.query(MenuItem)
                .filter(MenuItem.id == item.menu_item_id)
                .with_for_update()
                .first()
            )

            if not menu:
                raise HTTPException(status_code=404, detail="Menu tidak ditemukan")

            if not menu.is_available:
                raise HTTPException(status_code=400, detail=f"{menu.name} tidak tersedia")

            if menu.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Stok {menu.name} tidak cukup. Stok tersisa: {menu.stock}",
                )

            menu.stock -= item.quantity
            total_price += menu.price * item.quantity

            order_items_data.append({
                "menu_id": menu.id,
                "quantity": item.quantity,
                "price": menu.price,
            })

        queue_number = generate_queue_number(db)

        order = Order(
            customer_name=payload.customer_name,
            queue_number=queue_number,
            total_price=total_price,
            status="waiting",
            idempotency_key=idempotency_key,
            estimated_ready_minutes=10,
        )

        db.add(order)
        db.flush()

        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=order.id,
                menu_item_id=item_data["menu_id"],
                quantity=item_data["quantity"],
                price=item_data["price"],
            )
            db.add(order_item)

        db.commit()
        db.refresh(order)

        background_tasks.add_task(
            process_order_background,
            order.id,
            order.queue_number,
        )

        return {
            "message": "Pesanan berhasil dibuat",
            "order_id": order.id,
            "queue_number": order.queue_number,
            "total_price": order.total_price,
            "status": order.status,
            "estimated_ready_minutes": order.estimated_ready_minutes,
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Checkout gagal: {str(e)}")


@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.id.desc()).all()
    return orders


@router.get("/{order_id}")
def get_order_detail(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order tidak ditemukan")

    return order


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    allowed_status = ["waiting", "processing", "ready", "completed", "cancelled"]

    if payload.status not in allowed_status:
        raise HTTPException(status_code=400, detail="Status tidak valid")

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order tidak ditemukan")

    order.status = payload.status

    db.commit()
    db.refresh(order)

    return {
        "message": "Status order berhasil diperbarui",
        "data": order,
    }