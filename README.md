# 🎬 Book My Ticket

A simplified movie seat booking backend built with **Node.js**, **Express**, and **PostgreSQL**. Users can register, login, and book seats — with full JWT-based authentication protecting all booking routes.

---

## 🚀 Tech Stack

- **Runtime:** Node.js (ESModules)
- **Framework:** Express.js
- **Database:** PostgreSQL (via `pg` pool)
- **Auth:** JWT (Access Token + Refresh Token)
- **Password Hashing:** bcryptjs
- **Validation:** Custom DTO middleware
- **Containerization:** Docker (PostgreSQL via Docker Compose)

---



## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd book-my-ticket
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=8080
NODE_ENV=development

JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=5d
```

### 4. Start PostgreSQL using Docker

```bash
docker-compose up -d
```

> This starts a PostgreSQL instance on port `5433`.

### 5. Create the database tables

Connect to your DB (via pgAdmin, SQLTools, or psql) and run:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(323) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  refreshtoken VARCHAR(300),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seats table
CREATE TABLE seats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  isbooked INTEGER DEFAULT 0
);

-- Seed mock seats
INSERT INTO seats (name, isbooked) VALUES
  (NULL, 0), (NULL, 0), (NULL, 0), (NULL, 0), (NULL, 0),
  (NULL, 0), (NULL, 0), (NULL, 0), (NULL, 0), (NULL, 0);
```

### 6. Start the server

```bash
npm run dev
```

Server runs on `http://localhost:8080`

---

## 🔐 Authentication Flow

```
Register → Login → Get Access Token → Use Token in requests
```

All booking routes are protected. You must include the access token in every request:

```
Authorization: Bearer <accessToken>
```

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login and get tokens |
| POST | `/api/auth/refresh` | ❌ | Get new access token using refresh token |
| POST | `/api/auth/logout` | ✅ | Logout and clear refresh token |

### Seat Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| GET | `/seats` | ✅ | Get all seats and their booking status |
| PUT | `/book/:id` | ✅ | Book a seat by seat ID |

---



## 🛡️ Key Implementation Details

**Duplicate booking prevention** — handled using PostgreSQL transactions with `FOR UPDATE` lock. If a seat is already booked (`isbooked = 1`), the request is rejected immediately.

**User identity from token** — the booking route does not take a name as input. The logged-in user's name is automatically extracted from the JWT token via the `authenticate` middleware.

**Refresh token rotation** — refresh tokens are stored in the database. On logout, the token is set to `NULL`, invalidating any future refresh attempts.

**SQL injection prevention** — all queries use parameterized statements (`$1`, `$2`) instead of string interpolation.

---

## 🗃️ Database Schema

```
users
├── id           SERIAL PRIMARY KEY
├── fullname     VARCHAR(100)
├── email        VARCHAR(100) UNIQUE
├── password     VARCHAR(255)       -- bcrypt hashed
├── refreshtoken VARCHAR(500)
└── created_at   TIMESTAMP

seats
├── id           SERIAL PRIMARY KEY
├── name         VARCHAR(100)       -- name of person who booked
└── isbooked     INTEGER DEFAULT 0  -- 0 = available, 1 = booked
```