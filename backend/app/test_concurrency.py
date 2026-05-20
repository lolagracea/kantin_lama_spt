import requests
import uuid
from concurrent.futures import ThreadPoolExecutor

URL = "http://localhost:8000/api/orders/checkout"

def send_order(index):
    payload = {
        "customer_name": f"User {index}",
        "items": [
            {
                "menu_item_id": 1,
                "quantity": 1
            }
        ]
    }

    headers = {
        "Idempotency-Key": str(uuid.uuid4())
    }

    try:
        response = requests.post(URL, json=payload, headers=headers)
        return response.status_code, response.json()
    except Exception as e:
        return 500, {"error": str(e)}

with ThreadPoolExecutor(max_workers=50) as executor:
    results = list(executor.map(send_order, range(100)))

success = [r for r in results if r[0] == 200]
failed = [r for r in results if r[0] != 200]

print("Total request:", len(results))
print("Berhasil:", len(success))
print("Gagal:", len(failed))
print("Contoh hasil:", results[:5])