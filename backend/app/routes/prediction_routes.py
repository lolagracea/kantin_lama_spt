from fastapi import APIRouter, HTTPException
from ..schemas import PredictionRequest
from ..ml_model import predict_demand

router = APIRouter()


@router.post("/demand")
def demand_prediction(payload: PredictionRequest):
    try:
        result = predict_demand(
            day_of_week=payload.day_of_week,
            hour=payload.hour,
            menu_id=payload.menu_id,
            stock_start=payload.stock_start,
        )

        return {
            "message": "Prediksi demand berhasil",
            "input": {
                "day_of_week": payload.day_of_week,
                "hour": payload.hour,
                "menu_id": payload.menu_id,
                "stock_start": payload.stock_start,
            },
            "result": result,
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="Model prediksi belum tersedia. Silakan training model di Google Colab terlebih dahulu.",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediksi gagal: {str(e)}")