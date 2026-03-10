# VEYOR — Freight SaaS Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

VEYOR is a full-stack freight marketplace platform that connects shippers with carriers through a real-time quoting, booking, and shipment management system. It demonstrates a production-grade hybrid microservices architecture combining a Java Spring Boot monolith, Go microservices, a Next.js frontend, an AI support agent, and a full observability stack. 

This is a learning exercise and not a full fledged marketplace, even though it´s production grade. The purpose is to experiment with the latest innovations in infrastructure, multi agent orchestration and technologies.

---

## Features

**Shipper-facing**
- Route search with origin/destination, weight, cargo type, and Incoterms selection
- Real-time multi-carrier quote comparison (price, transit days, carrier rating)
- One-click booking with instant confirmation and tracking number
- Shipment dashboard with live status tracking
- AI-powered support chat (LangChain ReAct agent)

**Admin portal**
- User management with RBAC (SUPER_ADMIN, FINANCE_MANAGER, SUPPORT_AGENT)
- Revenue analytics and booking volume dashboards
- Tariff and carrier rate management
- Grafana observability dashboard

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (port 3000)             │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / HTTP
┌──────────────────────────▼──────────────────────────────────┐
│           Spring Boot Core API (port 8080)                  │
│  Identity · Booking · Shipment · Admin · Notifications      │
└──────────┬──────────────────────────────────┬───────────────┘
           │ gRPC                             │ Kafka
┌──────────▼──────────┐           ┌───────────▼───────────────┐
│  Go Quoting Service │           │  Go Carrier Simulator     │
│      (port 50051)   │           │      (port 8081)          │
└─────────────────────┘           └───────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────┐
│  AI Support Agent — FastAPI + LangChain (port 8000)         │
└─────────────────────────────────────────────────────────────┘

Infrastructure: PostgreSQL · Redis · Kafka · Prometheus · Grafana · Jaeger · Loki
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TailwindCSS, TypeScript |
| Core API | Java 21, Spring Boot 3, Spring Security, JPA/Hibernate |
| Quoting | Go 1.21, gRPC/protobuf |
| Carrier Sim | Go 1.21, REST HTTP server |
| AI Agent | Python 3.11, FastAPI, LangChain, OpenAI |
| Database | PostgreSQL 15, Flyway migrations |
| Cache | Redis 7 |
| Messaging | Apache Kafka 3 |
| Auth | JWT (HMAC-SHA256), RBAC |
| Observability | Prometheus, Grafana, Jaeger (OpenTelemetry), Loki |
| Infrastructure | Docker Compose |

---

## Project Structure

```
.
├── frontend/              # Next.js 14 App Router application
│   ├── app/               # Pages: /, /results, /booking/[id], /tracking, /admin
│   └── components/        # Shared UI components
├── backend/               # Spring Boot monolith
│   └── src/main/java/com/veyor/marketplace/
│       ├── modules/identity/     # Auth, JWT, RBAC
│       ├── modules/booking/      # Shipments, quotes
│       ├── modules/admin/        # Admin management
│       └── modules/notification/ # Email notifications
├── quoting-service/       # Go gRPC quoting microservice
├── carrier-simulator/     # Go carrier rate simulator
├── agents/                # Python AI support agent
├── infra/                 # Docker Compose + Grafana dashboards
└── docs/                  # Functional requirements, ADRs, NFRs
```

---

## Getting Started

### Prerequisites

- Docker Desktop
- Java 21 + Gradle
- Node.js 18+
- Go 1.21+
- Python 3.11+

### Quick Start

```bash
# 1. Start infrastructure (Postgres, Kafka, Redis, Grafana, Jaeger, Loki)
cd infra && docker compose up -d

# 2. Start the Spring Boot backend
cd backend && ./gradlew bootRun

# 3. Start the Next.js frontend
cd frontend && npm install && npm run dev

# 4. (Optional) Start the Go quoting service
cd quoting-service && go run cmd/server/main.go

# 5. (Optional) Start the Go carrier simulator
cd carrier-simulator && go run main.go

# 6. (Optional) Start the AI agent
cd agents && pip install -r requirements.txt && uvicorn main:app --port 8000
```

### Secrets and local config

- **Backend:** Copy `backend/src/main/resources/application-local.properties.example` to `application-local.properties` and set your local DB password (see [SECURITY.md](SECURITY.md)).
- **Agents:** Copy `agents/.env.example` to `agents/.env` and add your `OPENAI_API_KEY` and `LANGCHAIN_API_KEY`. Never commit `.env`.
- **Frontend:** Copy `frontend/.env.example` to `frontend/.env.local` if you need to override API URL or Flagsmith.

### Service URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Grafana | http://localhost:3001 |
| Jaeger UI | http://localhost:16686 |
| Prometheus | http://localhost:9090 |
| AI Agent | http://localhost:8000 |

### Default Users

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@veyor.com | Admin1234! |
| Finance Manager | finance@veyor.com | Finance1234! |
| Support Agent | support@veyor.com | Support1234! |

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate and receive JWT |
| GET | `/api/quotes/search` | Search for freight quotes |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/shipments/{id}` | Get shipment details |
| GET | `/api/admin/users` | List users (admin) |
| GET | `/api/admin/bookings` | List all bookings (admin) |

Full API reference is available in [docs/frd.md](docs/frd.md).

---

## Observability

- **Metrics**: Prometheus scrapes Spring Boot Actuator (`/actuator/prometheus`). Pre-built Grafana dashboards for business KPIs and system health.
- **Tracing**: OpenTelemetry instrumentation sends traces to Jaeger via OTLP.
- **Logs**: Structured JSON logs aggregated by Loki, queryable in Grafana.

---

## Non-Functional Requirements

- **Availability**: 99.9% uptime target
- **Latency**: Quote search p95 < 2 s; booking confirmation < 500 ms
- **Throughput**: 500 concurrent users, 50 bookings/minute
- **Security**: JWT auth, RBAC, input validation, OWASP compliance

Full NFR document: [docs/adr/nfr.md](docs/adr/nfr.md)

---

## License

MIT License — Copyright (c) 2026 Pol Fenollar Villà. See [LICENSE](LICENSE) for details.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
