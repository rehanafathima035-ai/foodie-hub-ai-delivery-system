# FoodieHub AI - Premium Food Delivery Platform

FoodieHub AI is a professional, production-ready full-stack food delivery application built with a modern tech stack. It features a premium UI, smooth animations, and a robust Flask-based REST API.

## 🚀 Features

- **Premium UI/UX**: Modern design with Glassmorphism, smooth AOS animations, and a responsive mobile-first layout.
- **AI Recommendation Engine**: Mock AI logic to suggest top-rated meals to users.
- **Authentication**: Secure user registration and login with Flask-Bcrypt hashing.
- **Restaurant & Menu Management**: Detailed restaurant listings with dynamic menu loading.
- **Cart & Order System**: Complete shopping cart functionality, coupon support, and order history tracking.
- **Admin Dashboard**: Real-time analytics, revenue tracking with Chart.js, and management overview.
- **Dark Mode**: Seamless theme switching with persistence.
- **Search & Suggestions**: Real-time search for restaurants and dishes with auto-suggestions.

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6), Bootstrap 5, Font Awesome, AOS, Chart.js, Toastify.
- **Backend**: Python Flask, Flask-SQLAlchemy (ORM), Flask-Bcrypt, Flask-Session (Filesystem).
- **Database**: MySQL (via PyMySQL driver).

## 📂 Project Structure

```text
FoodDeliveryApp/
├── backend/
│   ├── app.py             # Main entry point
│   ├── config.py          # App configuration
│   ├── database.py        # DB & Extension init
│   ├── models/            # SQLAlchemy Models
│   ├── routes/            # Modular Blueprint Routes
│   └── static/            # CSS, JS, and Images
├── frontend/              # HTML Templates
├── database/              # SQL Schema & Seed Data
└── requirements.txt       # Dependencies
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Python 3.8+
- MySQL Server (XAMPP, WAMP, or Standalone)

### 2. Database Setup
1. Open your MySQL client (e.g., phpMyAdmin).
2. Create a database named `food_delivery_db`.
3. Import the `database/fooddelivery.sql` file to create tables and seed some initial data.

### 3. Backend Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Update `backend/config.py` with your MySQL credentials (if different from default).

### 4. Run the Application
```bash
python backend/app.py
```
The app will be available at `http://127.0.0.1:5000`.

## 🎨 Design Philosophy
- **Primary Color**: #FF6B35 (Energetic Orange)
- **Secondary**: #FFF4EF (Soft Peach)
- **Aesthetic**: Minimalist yet premium, utilizing soft shadows and glass-like surfaces to create depth.

---
Built with ❤️ for Technical Portfolios.
