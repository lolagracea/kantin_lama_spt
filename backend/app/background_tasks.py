import time


def process_order_background(order_id: int, queue_number: str):
    """
    Simulasi proses asynchronous setelah checkout.
    Contoh nyata:
    - kirim notifikasi
    - catat log
    - update estimasi
    - generate laporan
    """
    print(f"[BACKGROUND TASK] Memproses order {order_id} dengan nomor {queue_number}")
    time.sleep(3)
    print(f"[BACKGROUND TASK] Order {order_id} selesai diproses di background")