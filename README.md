# 🚘 Drowsy Detection App — *Nolep*


## 📌 Latar Belakang

Peningkatan jumlah kendaraan bermotor di Indonesia berdampak langsung pada naiknya angka kecelakaan lalu lintas. Berdasarkan data Korlantas Polri dari Januari hingga Agustus 2024, tercatat **79.220 kasus kecelakaan**, dengan puncaknya pada bulan April sebanyak **11.924 kejadian**. Total kendaraan yang terlibat mencapai **722.470 unit**, dan sebanyak **71,8% di antaranya disebabkan oleh kelelahan dan kantuk**.

Hal ini menunjukkan perlunya sistem deteksi kantuk yang dapat memberikan peringatan dini kepada pengemudi guna mencegah kecelakaan fatal di jalan raya.


## 👨‍💻 Tim Pengembang

| Nama Lengkap               | NIM                      |
|----------------------------|---------------------------|
| Faundra Pratama Sukma      | 22/505520/TK/55323        |
| Adinda Putri Romadhon      | 22/505508/TK/55321        |
| Aisa Selvira Q.A           | 22/498561/TK/54690        |


## 🚀 Tentang Aplikasi

**Drowsy Detection App — Nolep** adalah prototipe sistem deteksi kantuk berbasis AI yang dirancang untuk digunakan oleh pengendara secara pribadi. Aplikasi ini mengidentifikasi tanda-tanda kantuk melalui kamera dan AI, serta memberikan **peringatan secara real-time** agar pengemudi dapat segera beristirahat.


## 🧩 Fitur Unggulan

- 🔐 **Autentikasi Aman** — menggunakan Clerk dengan integrasi Next.js
- 📊 **Dashboard Visualisasi**:
  - Pie chart: distribusi notifikasi peringatan
  - Bar chart: riwayat peringatan kantuk mingguan
- 🗺️ **Halaman Peta** — menampilkan lokasi tempat istirahat terdekat
- 🧠 **Prediksi AI** — mendeteksi kantuk melalui analisis wajah pengguna
- 🌍 **Deploy via GitHub Pages** — untuk keperluan dokumentasi dan demo


## ⚙️ Teknologi yang Digunakan

| Teknologi        | Kegunaan                                      |
|------------------|-----------------------------------------------|
| **Next.js + TS** | Frontend dan UI berbasis React + TypeScript   |
| **Clerk**        | Sistem autentikasi dan manajemen pengguna     |
| **Express.js**   | Backend API dan pengelolaan routing           |
| **AI Model**     | Deteksi kantuk berbasis analisis wajah        |
| **GitHub Pages** | Hosting dokumentasi proyek secara statis      |


## 🚀 Deployment

Aplikasi dapat diakses di:  
🌐 [https://nolep-two.vercel.app](https://nolep-two.vercel.app)

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)
- PostgreSQL (or your preferred database)

### Setup Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/nolep.git
   cd nolep/nolep
2. Install dependencies
   ```bash
   npm install
3. Database set-up
   ```bash
   npx prisma generate
   npx prisma db push
   npm install @prisma/client
4. Run development server
   ```bash
   npm run dev



## 🏫 Institusi

> **Departemen Teknik Elektro dan Teknologi Informasi**  
> Fakultas Teknik, Universitas Gadjah Mada  
> **Senior Project TI — 2025**



