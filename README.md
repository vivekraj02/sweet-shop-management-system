# Sweet Symphony Management System

This is a Node.js + Express backend for the Sweet Symphony Management System with MongoDB as the database.

## Features
- User registration and login with JWT-based authentication
- Roles: user and admin
- Sweets CRUD and inventory management
- Purchase and restock endpoints
- Search by name, category, and price range

## Tech Stack
- Node.js + Express
- MongoDB (via Mongoose)
- JWT for authentication
- bcrypt for password hashing
- Jest + Supertest for tests
- mongodb-memory-server for test DB

## Setup
- Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `JWT_SECRET`.

Install dependencies:

```bash
npm install
```

Start server in development:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/sweets (Protected)
- GET /api/sweets (Protected)
- GET /api/sweets/search (Protected)
- PUT /api/sweets/:id (Protected)
- DELETE /api/sweets/:id (Admin only)
- POST /api/sweets/:id/purchase (Protected)
- POST /api/sweets/:id/restock (Admin only)

## My AI Usage
- **Tools used**: Raptor mini (Preview), GitHub Copilot, local documentation
- **How used**: I used AI to plan the project structure, generate boilerplate for the API, and draft tests for endpoints. I wrote the final version manually and adapted code for security and testability.

## Notes
- This repository includes the backend API and a frontend SPA built with React and Vite, and unit/integration tests for the backend.
- The frontend is in the `client/` folder and uses `VITE_API_BASE` env variable (default: `http://localhost:4000`).
- The tests use an in-memory MongoDB server.

## Frontend Setup

Install frontend dependencies and start the client:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000` to view the frontend. You can use the app to register/login, list sweets, purchase, and (if admin) add/update/delete sweets.

