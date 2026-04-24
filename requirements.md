# EdgeURL – Requirements Document

## Scope

* Build a simple full-stack URL shortener web app
* Users can input a long URL and receive a shortened version
* System stores URLs, tracks usage, and allows redirects
* Includes basic analytics (click count) and logs page
* Designed as a local development project (not deployed publicly)

---

## Functional Requirements

* Users can submit a valid URL
* System generates a unique short URL
* Users are redirected when visiting a short URL
* System stores:

  * original URL
  * short code
  * click count
  * timestamp
* System increments click count on each redirect
* Prevent duplicate URLs by reusing existing short codes
* Display all stored URLs on a logs page
* Allow reset/clear of stored data
* Validate URLs (must include http/https)

---

## Non-Functional Requirements

* Fast redirects (use Redis caching)
* Handle multiple requests without crashing
* Basic protection against abuse (rate limiting)
* Clean and simple UI
* Maintainable and readable code
* Containerised setup (Docker) for easy execution
* Minimal setup required for new users (1 command run)

---

## Justifications

* **Redis caching** reduces database load and improves redirect speed
* **Base62 encoding** creates short, readable URLs without collisions
* **Rate limiting** prevents spam or abuse of the service
* **Docker** ensures consistent setup across different machines
* **MySQL** provides reliable structured data storage

---

## Possible Extensions

* User accounts and authentication 
* Custom short URLs (user-defined aliases)
* Advanced analytics (IP tracking, location, device info)
* Expiring links
* Public deployment (AWS / cloud hosting)
* UI improvements and dashboard

---
