# ShopMate — E-commerce Backend 🛒

RESTful backend API for the ShopMate e-commerce application.

## 🚀 Live API

**Backend:**
https://mern-ecommerce-backend-1-6xa4.onrender.com

## 📌 Features

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Product management
* Category management
* Shopping cart management
* Wishlist management
* Address management
* Order management
* Order status updates
* Admin dashboard statistics
* User management
* Role-based access control
* MongoDB database integration

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* CORS
* dotenv

## 📂 Project Structure

```text
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── index.js
├── package.json
└── .env
```

## 🔐 Authentication

The application uses JWT authentication.

After successful login, the client receives a JWT token. The token is sent with protected API requests using the `Authorization` header.

```text
Authorization: Bearer <token>
```

Passwords are securely hashed using bcrypt before being stored in the database.

## 🔗 Main API Routes

| Feature        | Endpoint    |
| -------------- | ----------- |
| Authentication | `/auth`     |
| Categories     | `/category` |
| Products       | `/products` |
| Cart           | `/cart`     |
| Wishlist       | `/wishlist` |
| Addresses      | `/address`  |
| Orders         | `/orders`   |
| Admin          | `/admin`    |

## ⚙️ Environment Variables

Create a `.env` file in the backend root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit `.env` to GitHub.

## 💻 Run Locally

### 1. Clone the repository

```bash
git https://github.com/sreejithKpy/mern-ecommerce-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

Add the required environment variables.

### 4. Start development server

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:3000
```

## ▶️ Production

The backend is deployed using Render and connected to MongoDB Atlas.

## 👨‍💻 Author

**Sreejith**

## 📄 License

This project is developed for learning and portfolio purposes.
