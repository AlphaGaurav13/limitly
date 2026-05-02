# 🛡️ Limitly  
### Smart Rate Limiting Engine for Modern APIs

I built a distributed rate limiting service using Redis, Lua scripts for atomic operations, JWT-based authentication, API key management, and analytics tracking.  
Limitly is a configurable, multi-strategy rate limiting service built using the MERN stack. It allows developers to protect their applications from abuse by defining custom request limits using API keys.

---

## 📌 Overview

Limitly acts as a centralized rate limiting engine where clients can:

- 🔑 Generate API keys  
- ⚙️ Configure request limits  
- 🛡️ Protect applications from abuse and traffic spikes  

---

## ⚙️ Features

- 🔐 User Authentication (Register/Login)  
- 🔑 API Key Management (Generate, View, Delete)  
- 📊 Configurable Rate Limits (Free: 5 req/min, Pro: 100 req/min)  
- 🧠 Sliding Window Log Algorithm (Redis + Lua for atomic operations)  
- 🧩 Middleware-based integration  
- 📈 Real-time Analytics Dashboard (Total, Allowed, Blocked, Top Endpoints, Top Users)  
- 🚫 Abuse protection (brute-force, spam)  
- 🗑️ Auto-expiry of API keys (60 days)  
- 🔒 Max 3 API keys per user per day  

---

## 🏗️ Architecture

```text
Your Website/App  →  Limitly API  →  Rate Limiter Engine  →  Redis (Lua Scripts)
     ↓                    ↓
  check-limit        Analytics
  (per request)      (tracking)
```

---

## 🧰 Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Backend     | Node.js, Express 5             |
| Database    | MongoDB (users, API keys)      |
| Cache/Store | Redis (rate limiting, analytics)|
| Auth        | JWT (JSON Web Tokens)          |
| Algorithm   | Sliding Window Log (Lua Script)|
| Frontend    | React + Vite                   |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Redis (Docker recommended)
- npm

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/limitly.git
cd limitly
```

### 2. Start Redis (Docker)

```bash
docker run -d --name limitly-redis -p 6379:6379 redis
```

### 3. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```env
PORT=3000
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your_super_secret_key
MONGO_URI=mongodb+srv://your_mongo_connection_string
```

Start the server:

```bash
npm run dev
```

### 4. Setup Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## 📖 API Reference

> **Base URL:** `http://localhost:3000`

---

### 🔐 Auth Endpoints

#### Register a new user

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "message": "User registered",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

> 💡 **Save the `token`** — you'll need it for all authenticated requests.

---

### 🔑 API Key Management

> All requests require `Authorization: Bearer <your_jwt_token>` header.

#### Generate API Key

```http
POST /api/generate-key
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "apiKey": "b3ecd2ef923e0abda4d987667c836888"
}
```

#### Get All Your API Keys

```http
GET /api/keys
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
[
  {
    "_id": "...",
    "key": "b3ecd2ef923e0abda4d987667c836888",
    "userId": "...",
    "CreatedAt": "2026-05-02T..."
  }
]
```

#### Delete an API Key

```http
DELETE /api/keys/<your_api_key>
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "message": "Deleted"
}
```

---

### 🛡️ Rate Limit Check (Core API)

> This is the **main endpoint** you'll call from your website/app to check if a request should be allowed.

```http
POST /api/check-limit
Content-Type: application/json

{
  "apiKey": "your_generated_api_key",
  "endpoint": "/api/login",
  "userId": "user_123"
}
```

**Response (Allowed):**
```json
{
  "allowed": true,
  "remaining": 4,
  "retryAfter": 0
}
```

**Response (Blocked):**
```json
{
  "allowed": false,
  "remaining": 0,
  "retryAfter": 58
}
```

| Field        | Description                                  |
|--------------|----------------------------------------------|
| `allowed`    | `true` if request is within limit            |
| `remaining`  | Number of requests left in current window    |
| `retryAfter` | Seconds to wait before next allowed request  |

---

### 📊 Analytics

```http
POST /api/analytics
Content-Type: application/json

{
  "apiKey": "your_generated_api_key"
}
```

**Response:**
```json
{
  "total": 25,
  "allowed": 20,
  "blocked": 5,
  "topUsers": [
    { "userId": "user_123", "count": 15 },
    { "userId": "user_456", "count": 10 }
  ],
  "topEndpoints": [
    { "endpoint": "/api/login", "count": 18 },
    { "endpoint": "/api/data", "count": 7 }
  ]
}
```

---

## 🌐 How to Use Limitly on Your Website

### Step 1: Get Your API Key

1. Register/Login on Limitly dashboard
2. Go to **API Keys** section
3. Click **Generate Key**
4. Copy the generated API key

### Step 2: Add the Rate Limit Check to Your Backend

Before processing any request on your server, call Limitly's `/api/check-limit` endpoint to verify if the request should be allowed.

#### Node.js / Express Example

```javascript
// middleware/rateLimiter.js

const LIMITLY_URL = "http://localhost:3000/api/check-limit";
const LIMITLY_API_KEY = "your_api_key_here"; // paste your Limitly API key

async function limitlyRateLimiter(req, res, next) {
  try {
    const response = await fetch(LIMITLY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: LIMITLY_API_KEY,
        endpoint: req.originalUrl,         // e.g. "/api/login"
        userId: req.ip || req.body.email   // identify the user
      })
    });

    const data = await response.json();

    if (!data.allowed) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: data.retryAfter,
        message: `Rate limit exceeded. Try again in ${data.retryAfter} seconds.`
      });
    }

    // Request allowed — continue
    next();

  } catch (err) {
    console.error("Limitly error:", err.message);
    // If Limitly is down, allow the request (fail-open)
    next();
  }
}

module.exports = limitlyRateLimiter;
```

#### Use it in your routes:

```javascript
const express = require("express");
const app = express();
const limitlyRateLimiter = require("./middleware/rateLimiter");

// Protect a specific route
app.post("/api/login", limitlyRateLimiter, (req, res) => {
  // your login logic
  res.json({ message: "Login successful" });
});

// Protect ALL routes
app.use(limitlyRateLimiter);
```

---

#### Python / Flask Example

```python
import requests

LIMITLY_URL = "http://localhost:3000/api/check-limit"
LIMITLY_API_KEY = "your_api_key_here"

def check_rate_limit(endpoint, user_id):
    try:
        response = requests.post(LIMITLY_URL, json={
            "apiKey": LIMITLY_API_KEY,
            "endpoint": endpoint,
            "userId": user_id
        })
        data = response.json()
        return data.get("allowed", True)
    except:
        return True  # fail-open

# Usage in Flask
@app.route("/api/data", methods=["POST"])
def get_data():
    if not check_rate_limit("/api/data", request.remote_addr):
        return jsonify({"error": "Rate limit exceeded"}), 429
    
    # your logic here
    return jsonify({"data": "..."})
```

---

#### Frontend (React / JavaScript) Example

```javascript
async function callApiWithRateLimit(endpoint, body) {
  // First, check rate limit
  const limitCheck = await fetch("http://localhost:3000/api/check-limit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: "your_api_key_here",
      endpoint: endpoint,
      userId: localStorage.getItem("userId") || "anonymous"
    })
  });

  const limitData = await limitCheck.json();

  if (!limitData.allowed) {
    alert(`Too many requests! Please wait ${limitData.retryAfter} seconds.`);
    return null;
  }

  // Rate limit passed — make your actual API call
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return response.json();
}
```

> ⚠️ **Important:** In production, always call the rate limit check from your **backend**, not frontend. The frontend example above is for testing/demo purposes only.

---

#### cURL Example (Quick Testing)

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "pass123"}'

# 2. Login & get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "pass123"}'

# 3. Generate API key (use token from step 2)
curl -X POST http://localhost:3000/api/generate-key \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Check rate limit (use API key from step 3)
curl -X POST http://localhost:3000/api/check-limit \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "YOUR_API_KEY", "endpoint": "/api/login", "userId": "user1"}'

# 5. View analytics
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "YOUR_API_KEY"}'
```

---

## 📋 Rate Limit Plans

| Plan | Requests | Window  | Best For             |
|------|----------|---------|----------------------|
| Free | 5        | 1 min   | Testing, small apps  |
| Pro  | 100      | 1 min   | Production apps      |

---

## 🔄 How It Works (Flow)

```
1. Your app receives a request
          ↓
2. Your backend calls Limitly: POST /api/check-limit
          ↓
3. Limitly checks Redis using Sliding Window Log (Lua script)
          ↓
4. Response: { allowed: true/false, remaining: N, retryAfter: S }
          ↓
5. If allowed → process the request
   If blocked → return 429 Too Many Requests
          ↓
6. Analytics tracked automatically (total, allowed, blocked, per-endpoint, per-user)
```

---

## 📁 Project Structure

```
Limitly/
├── Backend/
│   ├── server.js                  # Entry point
│   ├── app.js                     # Express app setup
│   ├── db/
│   │   ├── mongo.js               # MongoDB connection
│   │   └── redisClient.js         # Redis connection
│   ├── models/
│   │   ├── user.js                # User schema
│   │   └── ApiKey.js              # API Key schema (60-day TTL)
│   ├── routes/
│   │   ├── auth.routes.js         # /api/auth/*
│   │   ├── apiKey.routes.js       # /api/generate-key, /api/keys
│   │   ├── limit.routes.js        # /api/check-limit
│   │   └── analytics.routes.js    # /api/analytics
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── apiKey.controller.js
│   │   ├── limit.controller.js
│   │   └── analytics.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verification
│   │   └── apikey.middleware.js    # API key validation
│   ├── services/
│   │   ├── rateLimiter/
│   │   │   ├── RateLimiterService.js
│   │   │   └── strategies/
│   │   │       ├── RateLimiterStrategy.js    # Base class
│   │   │       └── SlidingWindowLog.js       # Redis + Lua implementation
│   │   ├── config/
│   │   │   └── apiKeyStore.js     # API key CRUD
│   │   ├── analytics/
│   │   │   └── analyticsService.js # Redis-based analytics
│   │   └── auth/
│   │       └── userStore.js
│   └── utils/
│       └── jwt.js                 # Token sign/verify
├── Frontend/                      # React + Vite dashboard
└── README.md
```

---

## 👨‍💻 Author

**Gaurav Kumar**  

---

## 📝 License

This project is for educational and portfolio purposes.
