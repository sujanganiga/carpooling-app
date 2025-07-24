# 🚗 Carpooling Web Application

A full-stack carpooling platform that connects passengers with drivers in a secure, user-friendly, and scalable way. Built using the **PERN stack** (PostgreSQL, Express.js, React.js, Node.js), this application includes cutting-edge features such as **AI-powered natural language search**, **multi-language support**, **dynamic role switching**, and a clean mobile-friendly UI.

---

## 🌐 Live Demo

> ⚠️ The backend is hosted on **Render's free tier**, which may take up to **50 seconds to wake up** after inactivity.

- 🔸 **Frontend (React.js + Tailwind)**: [https://carpoolingapp-iota.vercel.app](https://carpoolingapp-iota.vercel.app)
- 🔸 **Backend (Express.js API)**: [https://carpoolingapp.onrender.com](https://carpooling-app-1.onrender.com)
- 🔸 **Health Check**: [https://carpoolingapp.onrender.com/api/health](https://carpooling-app-1.onrender.com/api/health)

---

## 🎯 Features

- 🔐 **Authentication**: JWT-based login/register with secure password hashing.
- 🔄 **Role Switching**: Seamlessly switch between Driver and Rider roles.
- 🧠 **AI-Powered Search**: Natural language ride queries like *"rides to Mysore under ₹500 tomorrow morning"*.
- 🗺️ **Manual Route Entry**: Without GPS dependency.
- 🌍 **Multi-Language Support**: Supports English and Kannada using `i18next`.
- 💬 **Messaging & Notifications**: In-app chat + email alerts for booking and ride status.
- 📱 **Mobile-Responsive UI**: Built using Tailwind CSS and React.js.
- 🔁 **Recurring Rides**: Drivers can offer repeating rides.
- 📧 **Comprehensive Email System**: Booking confirmations, review requests, and ride alerts.
- 🌱 **Sustainability Metrics**: Carbon emission savings calculator.
- 📊 **Smart Pricing & Reviews**: AI-driven cost suggestions + multi-factor rating system.

---

## 🧑‍💻 Technology Stack

### Frontend
- **React.js** (v18.2.0)
- **Tailwind CSS** (v3.3.0)
- **React Router, Context API**
- **Framer Motion, i18next**

### Backend
- **Node.js** (v18.16.0)
- **Express.js**
- **JWT + bcrypt** for authentication
- **pg** (node-postgres)

### Database
- **PostgreSQL** (v15.4)
- Normalized schema with proper indexing & foreign keys

### DevOps / Deployment
- **Frontend**: Vercel
- **Backend & DB**: Render (free tier)
- **CI/CD**: GitHub Actions

---

## 🧭 Key Pages

- 🔑 Login & Signup with secure flow
- 🏠 Home Dashboard for both roles
- 🚘 Offer Ride (Driver Mode)
- 🎯 Find Rides (Rider Mode) with filters and AI Search
- 📅 My Rides Dashboard
- 📂 Profile Management
- 🌐 Multi-language toggler (English 🇬🇧 / Kannada 🇮🇳)

---

## 📦 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Backend Setup

```bash
cd backend
npm install
# Setup .env with DB configs
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🧠 Learnings & Highlights

* 🔐 Built secure RESTful API with JWT auth, refresh tokens, and cookie-based sessions.
* 🧩 Designed AI-powered keyword parsing for natural language ride search.
* 📚 Implemented multi-role system with dynamic views.
* 📲 Learned full deployment lifecycle on Vercel and Render.
* 🗃️ Practiced database migrations and seed scripts.
* 🧪 Focused on scalable architecture and modular component structure.

---

## 🛠️ Challenges Faced

* CORS issues across frontend-backend domains (resolved via CORS middleware)
* State sync across pages for role switching and bookings
* Optimistic UI updates with real-time toast notifications
* Handling PostgreSQL migrations without data loss
* Map and geolocation integration for manual ride input

---

## 🧑‍💼 Authors

Developed by: **Sujan Ganiga**  
BMS College of Engineering  
3rd Year - Information Science & Engineering  
Email: [sujan.ganiga2020@gmail.com](mailto:sujan.ganiga2020@gmail.com)

---

## 📄 License

This project is open-source and free to use under the [MIT License](LICENSE).
