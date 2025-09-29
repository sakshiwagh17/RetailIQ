# ⭐ Store Rating App

A full-stack web application where users can browse stores, rate them. 
Built using **React (Frontend)**, **Node.js + Express (Backend)**, and **MySQL (Database)**.

---

## 🚀 Features
- 🔐 User authentication (register/login)
- 🏬 Browse all stores with average ratings
- ⭐ Add ratings for stores
- 📖 View store details 
- 👤 Role-based access (User / Admin / Store Owner)
- 🌐 RESTful API with MySQL database

---

## 🏗 Tech Stack
### Frontend
- React.js
- Axios (API calls)
- React Router DOM

### Backend
- Node.js
- Express.js
- MySQL (with `mysql2/promise`)
- JWT (JSON Web Token) for authentication
- Bcrypt for password hashing
- dotenv, cors

### Database
- MySQL

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/store-rating-app.git

```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a .env file inside backend/:
``` bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=store_rating_app
JWT_SECRET=your_secret_key
PORT=3000
```
### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start
```
