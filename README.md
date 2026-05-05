# Drowsiness Detection Web Application — Nolep

## Overview
Nolep is a web-based drowsiness detection system powered by artificial intelligence. The application is designed to help drivers maintain alertness by detecting early signs of fatigue and issuing real-time warnings to reduce the risk of traffic accidents.

## Background
The increasing number of motor vehicles in Indonesia has led to a rise in traffic accidents. A significant portion of these incidents is caused by driver fatigue and drowsiness. This project aims to address this issue by providing a proactive monitoring system that detects drowsiness and encourages drivers to take preventive action.

## Development Team
| Name                     | Student ID          |
|--------------------------|---------------------|
| Faundra Pratama Sukma    | 22/505520/TK/55323  |
| Adinda Putri Romadhon    | 22/505508/TK/55321  |
| Aisa Selvira Q.A         | 22/498561/TK/54690  |

## Features
- Secure user authentication (Clerk + Next.js)
- Real-time drowsiness detection using AI
- Dashboard for visualizing alert history
- Map integration to locate nearby rest areas
- Web-based deployment for accessibility and demo

## System Architecture
The system consists of three main components:
1. **Frontend**: Built with Next.js and TypeScript
2. **Backend**: API services using Express.js
3. **AI Module**: Facial analysis for detecting drowsiness

## Technology Stack
| Technology        | Description                              |
|------------------|------------------------------------------|
| Next.js + TS     | Frontend framework and UI                |
| Clerk            | Authentication and user management       |
| Express.js       | Backend API handling                     |
| Prisma           | Database ORM                             |
| PostgreSQL       | Database system                          |
| AI Model         | Drowsiness detection via facial analysis |
| GitHub Pages     | Documentation hosting                    |

## Deployment
Access the application:
https://nolep-two.vercel.app

## Demo Video
https://youtu.be/isCOEafarSE

## Demo Credentials
| Email               | Password    |
|---------------------|-------------|
| noleptest@gmail.com | senprotest  |

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)
- PostgreSQL (or your preferred database)

### Setup Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/nolep.git
2. Masuk ke path nolep
   ```bash
   cd nolep/nolep
3. Install dependencies
   ```bash
   npm install
4. Database set-up
   ```bash
   npx prisma generate
   npx prisma db push
   npm install @prisma/client
5. Run development server
   ```bash
   npm run dev


## 📁 Struktur Proyek
- `.github/` — Workflow GitHub Actions  
- `ai-models/` — Model AI untuk deteksi kantuk  
- `docs/` — Dokumentasi proyek  
- `nolep/` — Source code utama aplikasi  
  - `app/` — Folder aplikasi frontend Next.js  
    - `api/` — API routes (backend)  
    - `camera/` — Modul kamera  
    - `components/` — Komponen UI reusable  
    - `drowsiness/` — Modul deteksi kantuk  
    - `home/` — Halaman utama  
    - `maps/` — Fitur peta  
    - `globals.css` — Styling global  
    - `layout.tsx` — Layout utama aplikasi  
    - `page.tsx` — Entry point halaman  
  - `prisma/` — Prisma ORM & schema database  
  - `public/` — File statis seperti gambar dan favicon  
  - `styles/` — Styling tambahan  
  - `middleware.ts` — Middleware Next.js  
  - `next.config.ts` — Konfigurasi Next.js  
  - `package.json` — Dependencies dan scripts  
  - `tsconfig.json` — Konfigurasi TypeScript  
- `scripts/` — Skrip tambahan (build, deploy, dsb)  
- `.env` — Environment variables (tidak diupload ke Git)



## 🏫 Institusi

Departemen Teknik Elektro dan Teknologi Informasi
Fakultas Teknik, Universitas Gadjah Mada  
Senior Project TI — 2025



