# Kantin Lama SPT

Proyek ini adalah aplikasi web pemesanan dan antrian cerdas untuk kantin, terdiri dari:

- `backend/`: FastAPI + SQLAlchemy + TensorFlow untuk API, manajemen menu, pemesanan, dan prediksi permintaan.
- `frontend/`: React + Vite untuk antarmuka pengguna.

## Prasyarat

- Python 3.11+ (atau versi Python yang kompatibel dengan dependensi FastAPI dan TensorFlow)
- Node.js 18+ dan npm
- `pip` untuk instalasi package Python

## Jalankan Backend

1. Buka terminal di folder `backend/`:

   ```bash
   cd backend
   ```

2. Siapkan lingkungan virtual (opsional tetapi direkomendasikan):

   ```bash
   python -m venv venv
   source venv/Scripts/activate
   ```

3. Install dependensi Python:

   ```bash
   pip install -r requirements.txt
   ```

4. Jalankan server FastAPI:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. Akses API:
   - Aplikasi backend: `http://127.0.0.1:8000`
   - Dokumentasi Swagger UI: `http://127.0.0.1:8000/docs`

### Catatan Model Prediksi

- File model TensorFlow `demand_model.keras` ada di folder `backend/`.
- Jika model tidak tersedia, endpoint prediksi akan mengembalikan error dan model perlu dilatih ulang terlebih dahulu.

## Jalankan Frontend

1. Buka terminal di folder `frontend/`:

   ```bash
   cd frontend
   ```

2. Install dependensi frontend:

   ```bash
   npm install
   ```

3. Jalankan server development Vite:

   ```bash
   npm run dev
   ```

4. Buka aplikasi di browser:
   - `http://127.0.0.1:5173`

## Struktur API Utama

Backend menyajikan endpoint berikut:

- `GET /api/menus/` — daftar menu
- `POST /api/menus/` — buat menu baru
- `PUT /api/menus/{menu_id}` — perbarui menu
- `DELETE /api/menus/{menu_id}` — hapus menu
- `GET /api/orders/` — daftar pesanan
- `GET /api/orders/{order_id}` — detail pesanan
- `POST /api/orders/checkout` — buat pesanan (checkout)
- `PATCH /api/orders/{order_id}/status` — update status pesanan
- `POST /api/predictions/demand` — prediksi permintaan menu
