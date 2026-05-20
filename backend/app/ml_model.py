import os
import numpy as np
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "demand_model.keras")

model = None


def load_prediction_model():
    global model

    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("File demand_model.keras belum ditemukan")
        model = tf.keras.models.load_model(MODEL_PATH)

    return model


def predict_demand(day_of_week: int, hour: int, menu_id: int, stock_start: int):
    loaded_model = load_prediction_model()

    input_data = np.array([[day_of_week, hour, menu_id, stock_start]], dtype=np.float32)

    prediction = loaded_model.predict(input_data, verbose=0)[0][0]

    predicted_demand = max(0, int(round(prediction)))
    recommended_stock = int(round(predicted_demand * 1.2))

    return {
        "predicted_demand": predicted_demand,
        "recommended_stock": recommended_stock,
    }