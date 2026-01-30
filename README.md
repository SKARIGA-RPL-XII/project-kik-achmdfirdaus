# 🚀 Human Resource Information System (HRIS)

Sistem Human Resource Information System (HRIS) berbasis web untuk membantu perusahaan dalam mengelola data karyawan, absensi, cuti, lembur, pelanggaran, serta penggajian secara terintegrasi dan efisien.

Dibangun menggunakan teknologi modern agar responsif, cepat, dan mudah dikembangkan.

---

## ✨ Fitur Utama

- 🔐 Autentikasi Login (Admin & Karyawan)
- 👤 Manajemen Data Karyawan
- 📅 Kalender Event & Cuti
- 🕒 Absensi Harian
- ⏱️ Lembur
- ⚠️ Pelanggaran
- 💰 Penggajian Otomatis
- 📊 Rekap & Laporan
- ⚡ Single Page Application (SPA Experience)

---

## 🛠️ Teknologi yang Digunakan

### Backend
- Laravel 9
- PHP 8+
- MySQL

### Frontend
- React + TypeScript
- Inertia.js
- Tailwind CSS
- shadcn/ui
- Lucide Icons

---

## 🧠 Arsitektur

Aplikasi menggunakan pendekatan:

Server Driven SPA dengan Inertia.js

Alur kerja:

Client (React) → Inertia → Laravel Controller → Database → Response → React Render

Keuntungan:
- Tidak perlu REST API terpisah
- Lebih sederhana
- Performa cepat seperti SPA
- Tetap mudah dikelola seperti aplikasi Laravel biasa

---

## 📂 Struktur Folder

```
app/
resources/js/
    components/
    pages/
    layouts/
routes/
database/
```

---

## ⚙️ Instalasi

### 1. Clone repository
```
git clone https://github.com/username/hris-app.git
cd hris-app
```

### 2. Install dependency
```
composer install
npm install
```

### 3. Setup environment
```
cp .env.example .env
php artisan key:generate
```

### 4. Konfigurasi database di .env
```
DB_DATABASE=hris
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Migrasi database
```
php artisan migrate
```

### 6. Jalankan project
```
php artisan serve
npm run dev
```

Buka:
```
http://localhost:8000
```

---

## 🗄️ Struktur Database (Ringkas)

Database digunakan untuk menyimpan seluruh data operasional sistem seperti:

- users
- karyawan
- absensi
- cuti
- lembur
- pelanggaran
- gaji
- kalender_event

Semua tabel saling terhubung untuk mendukung proses HR secara terintegrasi.

---

## 🎯 Tujuan Pengembangan

- Mempermudah pengelolaan data karyawan
- Mengurangi pencatatan manual
- Meningkatkan efisiensi administrasi HR
- Menyediakan laporan otomatis dan akurat

---

## 📸 Tampilan Sistem

Tambahkan screenshot di sini jika ada.

---

## 👨‍💻 Developer

Dikembangkan oleh:
Achmad Firdaus Ramadhani

Project pembelajaran / PKL / tugas akhir

---

## 📄 Lisensi

Project ini digunakan untuk keperluan pembelajaran dan pengembangan internal.
