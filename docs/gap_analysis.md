# Gap Analysis: Requirements vs. Current Implementation

**Date:** 2026-01-22
**Scope:** Quoting Engine, Carrier Integration, and System Architecture.

## 1. Executive Summary

A comprehensive audit of the codebase (`backend/` java source) against the requirements (`docs/frd quotation.md`, `docs/frd carrier.md`, `docs/adr/nfr.md`) reveals a **Systems-Level Discrepancy**.

The requirements describe a **Hybrid Microservices Architecture** (Java + Go) with real-time external simulation. The current system is a **Monolithic Java CRUD Application** with no quoting intelligence.

**Critical Finding:** The current `BookingController` accepts the `totalPrice` directly from the user request payload without validation. This is a severe security vulnerability (Price Manipulation) and functionally incorrect as per the FRD.

---

## 2. Exhaustive List of Consistency Gaps

### 2.1 Architectural Gaps

| # | Requirement (FRD/NFR) | Current Implementation | Severity |
| :--- | :--- | :--- | :--- |
| **A-1** | **Quoting Engine Microservice**: A dedicated Go (Golang) service for stateless calculation. | **Missing**. No Go code exists in the repository. | **Critical** |
| **A-2** | **Inter-Service Communication**: gRPC via Protobuf between Core (Java) and Quoting (Go). | **Missing**. No `.proto` definitions or gRPC clients exist. | **Critical** |
| **A-3** | **Carrier Simulator**: An external service (Node.js/Go) to mock shipping lines via REST. | **Missing**. No simulation code or container exists. | **Critical** |
| **A-4** | **Hybrid Runtime**: Running Java and Go side-by-side. | **Gap**. Only Java (Spring Boot) is configured in `ci-cd.yaml` and `docker-compose.yml`. | **High** |

### 2.2 Functional Logic Gaps

| # | Requirement (FRD/NFR) | Current Implementation | Severity |
| :--- | :--- | :--- | :--- |
| **L-1** | **Price Calculation**: Backend must calculate price based on simulator rates + margins. | **Gap**. `BookingController.java` blindly accepts `request.getTotalPrice()` from the frontend. | **Critical** |
| **L-2** | **Volumetric Weight**: Logic to take `MAX(Actual, Volumetric)` for LCL. | **Missing**. No weight calculation logic exists. | **High** |
| **L-3** | **Dynamic Surcharges**: Aggregating variable fees (BAF, CAF, OWS) from carriers. | **Missing**. No surcharge handling logic. | **High** |
| **L-4** | **Profit Margins**: Applying 15% markup + fixed fees. | **Missing**. No margin logic. | **High** |
| **L-5** | **Currency Conversion**: Converting Carrier Currency -> User Currency using Redis rates. | **Missing**. No currency conversion logic. | **High** |
| **L-6** | **Validation**: Validating `UN/LOCODE` against Redis Cache. | **Gap**. `request.getOriginAddress()` accepts a raw string without validation. | **Medium** |

### 2.3 Data & Infrastructure Gaps

| # | Requirement (FRD/NFR) | Current Implementation | Severity |
| :--- | :--- | :--- | :--- |
| **D-1** | **Redis Caching**: Caching quote results by Hash Key for 10 minutes. | **Gap**. Redis is present in `docker-compose` but only used for basic Spring Cache abstraction, not Quoting. | **Medium** |
| **D-2** | **Reference Data**: `REF:PORTS` loaded in Redis for high-speed validation. | **Gap**. Ports/Locations likely sit in Postgres (`LocationRepository`) or are missing. | **Medium** |
| **D-3** | **Event Driven Updates**: `LocationUpdatedEvent` (Kafka) syncing Catalog -> Quoting Engine. | **Gap**. `Location` updates are simple database writes. No Kafka event emission found for this flow. | **Medium** |

### 2.4 Integration Gaps

| # | Requirement (FRD/NFR) | Current Implementation | Severity |
| :--- | :--- | :--- | :--- |
| **I-1** | **Carrier Protocol**: REST/JSON with specific schema (`baseRate`, `surcharges` array). | **Missing**. No integration with any carrier (mock or real). | **Critical** |
| **I-2** | **Fault Tolerance**: Circuit Breaker opening after 5 failures. | **Missing**. No resilience patterns implemented for quoting. | **Medium** |

---

## 3. Recommended Remediation Plan

To close these gaps, we must move from **Monolith Expansion** to **Hybrid Service Injection**.

1.  **Phase 1: Carrier Simulator (The Foundation)**
    *   Create `simulation/` directory.
    *   Implement the Node.js/Go mock that satisfies `docs/frd carrier.md` (REST API).
    *   Add to `docker-compose.yml`.

2.  **Phase 2: Quoting Engine (The Brain)**
    *   Create `quoting-service/` (Go).
    *   Implement gRPC Server and REST Client for Simulator.
    *   Implement Core Logic (Weight, Margins, Currency).

3.  **Phase 3: Core Integration (The Connection)**
    *   Update `BookingController` (Java) to **stop** accepting user prices.
    *   Implement gRPC Client in Java (`BookingService`).
    *   Orchestrate the flow: Java -> gRPC -> Go -> REST -> Simulator.
