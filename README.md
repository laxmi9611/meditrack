# 🏥 MediTrack — Full-Stack Hospital Management System

A modern healthcare platform connecting patients, doctors, and administrators with appointment scheduling, digital prescriptions, and video consultations.

[![Live Demo](https://img.shields.io/badge/Live-Demo-coming_soon-lightgrey?style=for-the-badge)](#)
[![Backend](https://img.shields.io/badge/API-coming_soon-lightgrey?style=for-the-badge)](#)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-black?style=for-the-badge&logo=github)](https://github.com/laxmi9611/meditrack)

---

## 📖 About

MediTrack is a full-stack hospital management system supporting **3 roles** — Patient, Doctor, and Admin. It handles the complete healthcare workflow: appointment booking, digital prescriptions, medical records, and video consultations.

Built with **MERN stack**, **PDF generation**, **Jitsi video**, and **email notifications**.

---

## ✨ Features

### 👤 Patient
- Register / Login (JWT)
- Browse doctors by specialty
- View doctor profiles with ratings
- Book appointments with time slots
- Receive appointment confirmations via email
- Join video consultation (Jitsi)
- View & download prescriptions (PDF)
- Access medical history
- Rate & review doctors

### 👨‍⚕️ Doctor
- Register with specialty, experience, fees
- Dashboard with today's appointments
- Set availability (days + time slots)
- Approve / reject appointments
- Write digital prescriptions
- Auto-generated prescription PDF
- View patient medical history

### 👑 Admin
- Dashboard with analytics
- Verify doctor registrations
- Manage all users
- System statistics (charts)

### 🎥 Video Consultation
- Jitsi Meet integration (free, no signup)
- Join via unique room ID

### 📄 PDF Prescriptions
- Auto-generated on doctor's approval
- Downloadable by patient

### 🔔 Email Notifications
- Appointment confirmations
- Status updates
- Prescription ready

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework |
| React Router DOM | Routing |
| Context API | Global state |
| Axios | HTTP client |
| Recharts | Charts |
| React Toastify | Notifications |
| @jitsi/react-sdk | Video calls |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Auth |
| PDFKit | PDF generation |
| Nodemailer | Email |
| Cloudinary | Image storage |
| Multer | File uploads |

### DevOps
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Database |
| Render.com | Backend |
| Vercel | Frontend |
| Cloudinary | Image CDN |
| Jitsi Meet | Video calls |

---

## 📁 Project Structure