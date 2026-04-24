# EdgeURL

A full-stack URL shortener built with Node.js, Express, MySQL, and Redis.
Features caching, rate limiting, Base62 encoding, and request logging.

---

## Features

* Base62 short URL generation
* Duplicate URL reuse
* Redis caching (1-hour TTL)
* In-memory rate limiting (15 req/min)
* URL click tracking
* Asynchronous frontend
* Request logging with latency

---

## Tech Stack

* Node.js + Express
* MySQL
* Redis
* EJS
* Docker (fully containerised)

---

## How to Use

### 1. Install Docker

Download and install: https://www.docker.com/

### 2. Clone the repository

```bash
git clone <your-repo-url>
cd EdgeURL
```

### 3. Run the application

```bash
docker compose up --build
```

### 4. Open in browser

http://localhost:8080


## Stopping the App

```bash
docker compose down
```

Reset database (optional):

```bash
docker compose down -v
```

---

## Author

Oliver Lowman
