from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import MenuItem
from ..schemas import MenuCreate, MenuUpdate

router = APIRouter()


@router.get("/")
def get_menus(db: Session = Depends(get_db)):
    menus = db.query(MenuItem).order_by(MenuItem.id.desc()).all()
    return menus


@router.post("/")
def create_menu(payload: MenuCreate, db: Session = Depends(get_db)):
    menu = MenuItem(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        stock=payload.stock,
        image_url=payload.image_url,
    )

    db.add(menu)
    db.commit()
    db.refresh(menu)

    return {
        "message": "Menu berhasil dibuat",
        "data": menu,
    }


@router.put("/{menu_id}")
def update_menu(menu_id: int, payload: MenuUpdate, db: Session = Depends(get_db)):
    menu = db.query(MenuItem).filter(MenuItem.id == menu_id).first()

    if not menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan")

    update_data = payload.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(menu, key, value)

    db.commit()
    db.refresh(menu)

    return {
        "message": "Menu berhasil diperbarui",
        "data": menu,
    }


@router.delete("/{menu_id}")
def delete_menu(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(MenuItem).filter(MenuItem.id == menu_id).first()

    if not menu:
        raise HTTPException(status_code=404, detail="Menu tidak ditemukan")

    db.delete(menu)
    db.commit()

    return {
        "message": "Menu berhasil dihapus"
    }