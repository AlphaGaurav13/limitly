# 🚀 Limitly  
### Smart Rate Limiting Engine for Modern APIs

Limitly is a configurable, multi-strategy rate limiting service built using the MERN stack. It allows developers to protect their applications from abuse by defining custom request limits using API keys.

---

## 🧠 Overview

Limitly acts as a centralized rate limiting engine where clients can:

- 🔑 Generate API keys  
- ⚙️ Configure request limits  
- 🛡️ Protect applications from abuse and traffic spikes  

---

## ⚙️ Features

- 🔐 User Authentication (Register/Login)  
- 🔑 API Key Management  
- 📊 Configurable Rate Limits  
- 🧠 Multiple Algorithms:
  - Sliding Window  
  - Token Bucket  
  - (Optional) Leaky Bucket  
- 🧩 Middleware-based integration  
- 📈 Usage monitoring (basic dashboard)  
- 🚫 Abuse protection (brute-force, spam)  

---

## 🏗️ Architecture

```text
Client App → Limitly API → Rate Limiter Engine → Storage (Memory / Redis)
