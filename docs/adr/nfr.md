Freightos Marketplace Architecture Document
1. Scope & Goals
This architecture implements Freightos Marketplace 2.0 as described in the Functional Requirements Document (FRD), supporting multi-device access (desktop web, mobile web, and native mobile apps) and end-to-end shipment lifecycle: quote, booking, payment, tracking, documents, and notifications.
Architecture principles:
1. Keep it simple: small set of clear bounded contexts and services.
2. API-first: all functions exposed via REST APIs; all clients consume the same BFF and APIs.
3. Event-driven where it pays off: bookings, payments, tracking, notifications.
4. Tenant-safe & secure: all data partitioned by org_id.
5. Observable & resilient: standard patterns (circuit breaker, retries, CQRS for search).
2. High-Level Architecture & Context
Actors: Buyer users, Provider users, Internal users, and External systems (WebCargo and other providers, payment gateways, email/notification providers, chat widget).
Top-level components:
- Multi-device clients (desktop web SPA, mobile web, native mobile apps).
- API Gateway and Marketplace BFF.
- Domain microservices (Identity & Organization, Search & Quote, Provider Gateway, Booking, Payment, Shipment, Notification, Task & Guidance, Commodity, Profile, Referral & Credits, Admin, Document).
- Data stores: PostgreSQL, Redis, OpenSearch, S3.
- Event bus: Kafka for domain events, SQS for work queues.
3. Service Boundaries & Microservices
3.1 Identity & Organization (AccountContext)
Identity Service handles authentication (email/password, OAuth, MFA) and issues JWT/OIDC tokens with org and role claims. Organization Service manages org lifecycle (create, verify, restrict, suspend), org profile, and user–org memberships and roles. It exposes APIs for org and user management and emits OrganizationCreated and OrganizationStatusChanged events.
3.2 Marketplace Search & Quotes (QuoteContext)
Search & Quote Service validates search inputs, applies Recommended Services rules, builds canonical QuoteRequest objects, calls Provider Gateway, and persists QuoteRequests and QuoteOffers. It supports filters on price, expiry, mode, and seller, and exposes APIs for searching, retrieving quotes, saving searches, and manual quote requests. It stores data in PostgreSQL and OpenSearch and emits QuoteRequested, QuotesRetrieved, NoQuotesFound, ManualQuoteRequested, and QuoteExpired events.
3.3 Provider Integration (ProviderContext)
Provider Gateway Service integrates with WebCargo and other wholesalers. It normalizes provider-specific schemas into a canonical quote and booking model, applies circuit breakers, retries, and timeouts, and handles provider webhooks for booking confirmation and tracking. It exposes internal REST APIs for quotes and bookings, and emits ProviderQuoteReceived, ProviderUnavailable, ProviderBookingConfirmed, ProviderBookingRejected, and ProviderStatusEventReceived events.
3.4 Booking & Payments (BookingContext / PaymentContext)
Booking Service drives the Booking and Verification steps, performs org and user checks (including restriction flags), validates quote validity, orchestrates payment and provider booking as a Saga, creates shipments on success, and handles cancellation and manual overrides. Payment Service stores billing details and payment methods, manages card and invoice-on-account flows, captures and refunds payments, and integrates with the external payment gateway. Payment Service emits PaymentMethodAdded, PaymentAuthorized, PaymentCaptured, and PaymentFailed events.
3.5 Shipment Management & Tracking (ShipmentContext)
Shipment Service creates shipment records when bookings are confirmed, maintains shipment lifecycle, persists tracking events received via Provider Gateway, and exposes My Shipments list and shipment detail endpoints. It supports Repeat Shipment by generating prefilled quote requests. It uses PostgreSQL for transactional data and OpenSearch for read-optimized shipment lists and emits ShipmentCreated, ShipmentStatusUpdated, and ShipmentDocumentAdded events.
3.6 Notifications & Tasks (CommunicationContext)
Notification Service manages templates and channels (email, in-app, push), subscribes to Booking, Shipment, Account, and Payment events, dispatches notifications and stores notification history. Task & Guidance Service stores contextual task definitions (e.g., tips for reducing extra charges, export license checks) and exposes them to clients based on context (step, mode).
3.7 Account Area & Templates (ProfileContext)
Commodity Service manages My Commodities templates. Company Profile Service stores legal entity profiles and KYC documents. User Settings Service manages user-level preferences such as locale, currency override, notification preferences, and MFA settings.
3.8 Referrals & Credits (ReferralContext)
Referral Service creates and tracks referral links and calculates earned credits. Credits Service maintains credit balances per org and applies credits to bookings at checkout, emitting CreditGranted, CreditRedeemed, and CreditExpired events.
3.9 Admin & Compliance (AdminContext)
Admin Portal Service acts as the central backoffice for platform operations. It supports:
- **User & Org Management**: KYC/KYB workflows, status management, and impersonation.
- **Marketplace Operations**: Booking intervention, dispute resolution, and shipment oversight.
- **Financials**: Fee configuration, revenue reporting, and payout management.
- **CMS**: Management of banners, announcements, and help content.
- **Master Data**: CRUD for ports, container types, and commodities.
It exposes admin-only APIs, strictly protected by RBAC, and logs all state changes to an immutable Audit Log.

3.10 Cross-cutting Services
Document Service manages file upload and download, storing files in S3 and metadata in PostgreSQL, linking documents to shipments, orgs, and other entities. Chat/Support integration embeds a third-party widget in the UI and optionally posts contextual metadata to the support system.
4. Event Flows (EDRs)
Key domain events include QuoteRequested, QuotesRetrieved, NoQuotesFound, BookingInitiated, BookingConfirmed, BookingFailed, PaymentAuthorized, PaymentCaptured, PaymentFailed, ShipmentStatusUpdated, OrganizationStatusChanged, and NotificationSent. Each event is produced by the relevant service and consumed by others (for example, BookingInitiated triggers payment authorization; ShipmentStatusUpdated drives tracking timelines and notifications).
5. Architecture Decision Records (ADRs)
ADR-001: Domain-aligned microservices with a thin BFF.
ADR-002: AWS cloud deployment using managed services (ECS/EKS, RDS, MSK, S3, CloudFront, ALB).
ADR-003: PostgreSQL (RDS) per service schema for transactional consistency.
ADR-004: Kafka for domain events and SQS for background work.
ADR-005: CQRS only for read-heavy endpoints (quote and shipment lists) using OpenSearch.
ADR-006: REST integrations with providers and payment gateway, using circuit breakers and timeouts.
ADR-007: Single shared database per service partitioned by org_id for multi-tenancy.
ADR-008: REST/JSON over HTTPS for all APIs.
ADR-009: Central OIDC Identity Service with JWT-based authentication and authorization.
6. Integration Contracts
Provider Gateway exposes canonical contracts for quote requests, quote responses, booking requests, and tracking webhooks. Payment Service integrates with the payment gateway using tokenized payment intents and webhooks for payment status. Notification Service integrates with email providers and push notification providers using simple template-based contracts.
7. Non-Functional Requirements
Performance: P95 search and quote responses under 600 ms (2 s including provider latency), booking confirmation under 5 s, and shipment list responses under 400 ms. Horizontal scaling of stateless services, Redis caching, and CQRS read models ensure scalability.
Availability and resilience: 99.9% uptime targets for core APIs, multi-AZ deployments, managed databases, circuit breakers and retries for external integrations, and graceful degradation when providers or payment gateways are unavailable.
Security: HTTPS/TLS for all traffic, JWT/OIDC authentication, role-based authorization, encryption at rest, secure secrets management, and audit logging for sensitive actions. No raw payment card data is stored; only payment gateway tokens are retained.
-   **Admin Access**:
    -   All Admin API endpoints (`/api/admin/**`) must be secured with `hasRole('ADMIN')`.
    -   Financial data (revenue, transactions) must be strictly restricted to Admin users.
-   **Financial Integrity**:
    -   Transactions must be immutable once created.
    -   All financial operations must be logged for audit purposes.
    -   Payment tokens must be handled securely (PCI-DSS compliance considerations for future).
-   **Content Delivery**:
    -   CMS content should be cached at the edge (CDN) to minimize database load (future optimization).
    -   Master Data (Locations, Commodities) should be cached in the application layer as it changes infrequently.
**Admin Security**: MFA is mandatory for all admin users. Support agents see masked PII by default unless "Reveal" is explicitly audited.
Observability: Central metrics, logs, and traces with OpenTelemetry; dashboards for funnel analysis, provider reliability, and payment success rates; alerts on SLA and SLO breaches.
Data management: daily backups, point-in-time recovery, versioned document storage, clear retention policies, and consistent use of UTC for all timestamps.
Master Data: Core reference data (Locations, Commodities, Container Types) is currently mocked in the frontend for development speed but must be migrated to a dedicated service or database table before production.
8. Technology Stack
Frontend: React + TypeScript SPA for web (desktop and mobile web), using a shared design system and responsive layouts. Native mobile apps implemented with React Native (iOS and Android) consuming the same BFF and APIs.
Backend: Node.js with NestJS (or Java/Kotlin with Spring Boot) microservices, deployed as Docker containers on AWS ECS/EKS. AWS API Gateway or ALB acts as the entry point, backed by the Marketplace BFF.
Data & Messaging: PostgreSQL (RDS) for transactional data, Redis (ElastiCache) for caching, OpenSearch for search indices, Kafka (MSK) for domain events, SQS for background queues, and S3 for document storage.
Integrations: WebCargo and other providers via REST APIs and webhooks, payment gateway (e.g., Stripe/Adyen) via SDKs and webhooks, email provider (e.g., SES/SendGrid), and chat/support integrations (e.g., Intercom/Zendesk).
9. Multi-Device Architecture
The marketplace supports desktop web, mobile web, and native mobile apps. All clients share the same APIs and business logic through the Marketplace BFF and microservices. The web SPA is fully responsive with breakpoints for mobile, tablet, and desktop. The Task Center and stepper adapt layout per device (e.g., right-side panel on desktop, bottom sheet on mobile).
Native mobile apps (React Native) implement the same flows: Quote Search → Results → Booking → Verification, My Shipments (list and detail), Tasks and notifications, Account, Payments, and Referrals. They leverage device features such as push notifications and deep linking while keeping business logic server-side.
Non-functional requirements specific to mobile include: initial mobile web load P95 under 3 s on 4G, caching of recently viewed shipments, minimal offline read-only mode, secure token storage in OS keychains, and telemetry capturing performance and errors by device type.

10. Future Migration Strategy: Anti-Corruption Layer (ACL)
To facilitate a smooth transition from the current Modular Monolith to a Microservices Architecture, the **Anti-Corruption Layer (ACL)** pattern will be adopted.

**Purpose**:
The ACL functions as a translation layer between the new microservices and the legacy monolith (or other external systems). It prevents the legacy model's semantics from polluting the new domain model and ensures that new services can evolve independently.

**Implementation Strategy**:
1.  **Facade/Adapter**: When a new microservice needs to communicate with the monolith (or vice versa), it should not call the other's database or internal APIs directly. Instead, an ACL (implemented as a Facade or Adapter) will translate calls.
2.  **Data Synchronization**: If data must be shared, the ACL handles the synchronization logic (e.g., via events or double-writes) to keep the new and old systems consistent without tight coupling.
3.  **Gradual Strangler Fig**: As functionality is extracted from the monolith (Strangler Fig pattern), the ACL ensures that the frontend or other consumers see a consistent API, routing requests to the new service or the monolith as appropriate, often managed via the API Gateway.

**Key Benefits**:
-   **Decoupling**: New services are not bound to the legacy schema.
-   **Interoperability**: Seamless communication between architectures during the transition phase.
-   **Risk Reduction**: Allows for incremental migration with rollback capabilities.
