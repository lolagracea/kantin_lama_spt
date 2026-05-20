from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import menu_routes, order_routes, prediction_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Canteen IT Del API",
    description="Sistem Pemesanan dan Antrian Cerdas Kantin Lama IT Del",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(menu_routes.router, prefix="/api/menus", tags=["Menus"])
app.include_router(order_routes.router, prefix="/api/orders", tags=["Orders"])
app.include_router(prediction_routes.router, prefix="/api/predictions", tags=["Predictions"])


@app.get("/")
def root():
    return {
        "message": "Smart Canteen IT Del API is running"
    }