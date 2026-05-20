from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(Integer, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    is_available = Column(Boolean, default=True)
    image_url = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    queue_number = Column(String(20), nullable=False)
    total_price = Column(Integer, nullable=False)
    status = Column(String(30), nullable=False, default="waiting")
    idempotency_key = Column(String(100), unique=True, nullable=False)
    estimated_ready_minutes = Column(Integer, default=10)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    quantity = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem")


class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    prediction_date = Column(Date, nullable=False)
    predicted_demand = Column(Integer, nullable=False)
    recommended_stock = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())