from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date


class MenuCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    stock: int = 0
    image_url: Optional[str] = None


class MenuUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    stock: Optional[int] = None
    is_available: Optional[bool] = None
    image_url: Optional[str] = None


class OrderItemPayload(BaseModel):
    menu_item_id: int
    quantity: int


class CheckoutPayload(BaseModel):
    customer_name: str
    items: List[OrderItemPayload]


class OrderStatusUpdate(BaseModel):
    status: str


class PredictionRequest(BaseModel):
    day_of_week: int
    hour: int
    menu_id: int
    stock_start: int


class PredictionResponse(BaseModel):
    predicted_demand: int
    recommended_stock: int