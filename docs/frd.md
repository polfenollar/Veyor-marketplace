VEYOR Marketplace – Feature-by-Feature Implementation Plan (Cursor-Ready)
1. Purpose
This document breaks down the VEYOR Marketplace into implementable features, mapped to backend services, BFF endpoints, and web/mobile modules. It is optimized for use with Cursor so that development can be done step-by-step across multiple files while respecting the FRD, architecture, NFRs, guardrails and ADRs.
2. How to Use This Document with Cursor
For each feature:
1. Identify the Feature ID.
2. Open the relevant services and apps (paths listed under Modules & Files).
3. Use the corresponding Cursor feature prompt from this document.
4. Let Cursor summarize requirements, propose design, implement code and tests, and update ADRs as needed.
3. Generic Cursor Feature Prompt Template
You are implementing feature <FEATURE_ID> – "<FEATURE_NAME>" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature to implement:
- ID: <FEATURE_ID>
- Name: <FEATURE_NAME>
- Description: <copy from this doc>
- Affected services: <list from this doc>
- Affected apps/modules: <list from this doc>

Requirements:
- Respect all RULE-* from constraints docs.
- Respect NFRs (performance, security, observability).
- Maintain global coverage >= 80% and add tests per ARCH-05.
- Ensure multi-device parity: desktop web, mobile web, mobile app.

Steps:
1. Summarize relevant requirements from FRD + architecture docs + this feature spec.
2. Propose a concrete design: APIs, events, DTOs, data model changes.
3. Implement backend changes (services listed above).
4. Implement/update BFF endpoints.
5. Implement/update web and mobile UI modules.
6. Add unit, integration/contract, and relevant UI/E2E tests.
7. If implementation requires a new architectural decision or conflicts with an ADR,
   draft a new ADR via adr-server (if available) instead of silently deviating.

Work across multiple files as needed. After each group of changes, output a diff-style summary.
4. Feature Index (Overview)
F-001 – Quote Search & Recommended Services
F-002 – Quote Results & Filtering
F-003 – Booking & Verification Flow
F-004 – Payment & Billing Details
F-005 – Shipment Creation & “My Shipments” List
F-006 – Shipment Detail & Tracking Timeline
F-007 – Tasks & Guidance Panel
F-008 – Notifications Center (email, in-app, push)
F-009 – Account – Company Profile & KYC
F-010 – Account – Commodities Templates
F-011 – Referrals & Credits
F-012 – Admin – Org & Account Restriction Management
F-013 – Multi-Device Parity for Core Flows
F-001 – Quote Search & Recommended Services
Feature ID: F-001
Name: Quote Search & Recommended Services
Summary: User enters shipment details (origin, destination, load, goods) and sees recommended services before fetching quotes. Works on desktop web, mobile web and mobile app.
Services: quote-service, provider-gateway-service, task-service (optional), organization-service (optional)
Apps/Modules: /apps/web-frontend/src/features/search/*; /apps/mobile-app/src/screens/Search/*; /apps/bff/src/routes/quotes/*
Key APIs & Contracts:
BFF: POST /bff/quotes/search
Backend: POST /quotes/search (quote-service); POST /provider-gateway/quotes (provider-gateway-service)
Key Events:
QuoteRequested, QuotesRetrieved, NoQuotesFound
Implementation Checklist:
1. Implement QuoteSearchRequest DTO and validation in quote-service.
2. Build canonical QuoteRequest and emit QuoteRequested.
3. Integrate with provider-gateway-service and persist quote_requests and quote_offers.
4. Implement BFF endpoint to orchestrate search and recommended services.
5. Build responsive search UI and recommended services UI on web.
6. Build equivalent search screen on mobile.
7. Add unit, integration and UI tests to maintain coverage.
Cursor Prompt for F-001
You are implementing feature F-001 – "Quote Search & Recommended Services" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-001
- Name: Quote Search & Recommended Services
- Summary: User enters shipment details (origin, destination, load, goods) and sees recommended services before fetching quotes. Works on desktop web, mobile web and mobile app.
- Services: quote-service, provider-gateway-service, task-service (optional), organization-service (optional)
- Apps/Modules: /apps/web-frontend/src/features/search/*; /apps/mobile-app/src/screens/Search/*; /apps/bff/src/routes/quotes/*

### Master Data Requirements
- **Locations**: Supported ports and airports (e.g., Shanghai, New York, London).
- **Load Types**: Pallets, Boxes, Containers (20', 40', 40' HC).
- **Goods Types**: General Cargo, Electronics, Furniture, etc.
- **Note**: For MVP, this data is mocked in the frontend but should eventually come from a Master Data Service.

Additional implementation notes:
Ensure recommended services logic is reusable across web and mobile; avoid duplicating business rules on the client.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-002 – Quote Results & Filtering
Feature ID: F-002
Name: Quote Results & Filtering
Summary: After search, user sees a list of quotes with filters (price, expiry, mode, seller, green score, etc.) and provider badges. Works on all devices.
Services: quote-service, provider-gateway-service, bff
Apps/Modules: /apps/web-frontend/src/features/quote-results/*; /apps/mobile-app/src/screens/QuoteResults/*; /apps/bff/src/routes/quotes/*
Key APIs & Contracts:
BFF: GET /bff/quotes/{quoteRequestId}; GET /bff/quotes/{quoteRequestId}/offers?filters=...
Backend: GET /quotes/{quoteRequestId}; OpenSearch index quote_offers
Implementation Checklist:
1. Implement filterable read model in quote-service using OpenSearch.
2. Implement BFF endpoints exposing filtered offers.
3. Build results list and filters UI for web and mobile (using appropriate layouts).
4. Add tests for filter logic and UI interactions.
Cursor Prompt for F-002
You are implementing feature F-002 – "Quote Results & Filtering" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-002
- Name: Quote Results & Filtering
- Summary: After search, user sees a list of quotes with filters (price, expiry, mode, seller, green score, etc.) and provider badges. Works on all devices.
- Services: quote-service, provider-gateway-service, bff
- Apps/Modules: /apps/web-frontend/src/features/quote-results/*; /apps/mobile-app/src/screens/QuoteResults/*; /apps/bff/src/routes/quotes/*

Additional implementation notes:
Pay attention to performance and paging for large numbers of offers; design filters to be mobile-friendly (bottom sheet).

Follow the generic steps from the Feature Prompt Template (Section 3).
F-003 – Booking & Verification Flow
Feature ID: F-003
Name: Booking & Verification Flow
Summary: User selects a quote and confirms booking, going through verification (contacts, goods, payment, policies confirmation). Implements Saga across Payment and Provider Gateway. Works on all devices.
Services: booking-service, payment-service, provider-gateway-service, shipment-service, notification-service, organization-service
Apps/Modules: /apps/web-frontend/src/features/booking/*; /apps/mobile-app/src/screens/Booking/*; /apps/bff/src/routes/bookings/*
Key APIs & Contracts:
BFF: POST /bff/bookings; GET /bff/bookings/{id}
Backend: POST /bookings; POST /payments/authorize; POST /provider-gateway/bookings
Key Events:
BookingInitiated, BookingPaymentAuthorized, BookingPaymentFailed, BookingConfirmed, BookingFailed
Implementation Checklist:
1. Implement Booking Saga in booking-service with compensation.
2. Integrate payment-service (authorization, capture, failure handling).
3. Integrate provider-gateway-service for provider bookings.
4. On BookingConfirmed, trigger shipment creation (F-005).
5. Build multi-step Booking UI on web and mobile.
6. Add Saga unit tests, integration tests with mocked payment and provider, and E2E tests from search to shipment.
Cursor Prompt for F-003
You are implementing feature F-003 – "Booking & Verification Flow" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-003
- Name: Booking & Verification Flow
- Summary: User selects a quote and confirms booking, going through verification (contacts, goods, payment, policies confirmation). Implements Saga across Payment and Provider Gateway. Works on all devices.
- Services: booking-service, payment-service, provider-gateway-service, shipment-service, notification-service, organization-service
- Apps/Modules: /apps/web-frontend/src/features/booking/*; /apps/mobile-app/src/screens/Booking/*; /apps/bff/src/routes/bookings/*

Additional implementation notes:
Respect Saga design: do not call payment or provider directly from UI or BFF; they should always go through booking-service.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-004 – Payment & Billing Details
Feature ID: F-004
Name: Payment & Billing Details
Summary: Finance users can manage payment methods and billing details and reuse them during booking.
Services: payment-service, organization-service
Apps/Modules: /apps/web-frontend/src/features/account/billing/*; /apps/mobile-app/src/screens/Account/Billing/*; /apps/bff/src/routes/account/billing/*
Key APIs & Contracts:
GET /payments/orgs/{orgId}/methods; POST /payments/orgs/{orgId}/methods; GET /orgs/{id}/billing-profile; PUT /orgs/{id}/billing-profile
Implementation Checklist:
1. Implement payment methods CRUD (using payment gateway tokens).
2. Implement billing profile in organization-service.
3. Build account/billing pages for web and mobile.
4. Add unit and integration tests for billing and payment method management.
Cursor Prompt for F-004
You are implementing feature F-004 – "Payment & Billing Details" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-004
- Name: Payment & Billing Details
- Summary: Finance users can manage payment methods and billing details and reuse them during booking.
- Services: payment-service, organization-service
- Apps/Modules: /apps/web-frontend/src/features/account/billing/*; /apps/mobile-app/src/screens/Account/Billing/*; /apps/bff/src/routes/account/billing/*

Additional implementation notes:
Ensure no raw card data is persisted; only use payment gateway tokens as per security guardrails.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-005 – Shipment Creation & “My Shipments” List
Feature ID: F-005
Name: Shipment Creation & “My Shipments” List
Summary: After booking, shipments are created and users can see My Shipments with filters and paging on all devices.
Services: shipment-service, booking-service, bff
Apps/Modules: /apps/web-frontend/src/features/shipments/list/*; /apps/mobile-app/src/screens/Shipments/*; /apps/bff/src/routes/shipments/*
Key APIs & Contracts:
Backend: GET /shipments?filters=...
BFF: GET /bff/shipments?filters=...
Key Events:
ShipmentCreated
Implementation Checklist:
1. Create Shipment entity on BookingConfirmed.
2. Implement filterable shipments list in shipment-service with OpenSearch.
3. Build My Shipments list views on web and mobile.
4. Add tests for shipment creation and listing.
Cursor Prompt for F-005
You are implementing feature F-005 – "Shipment Creation & “My Shipments” List" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-005
- Name: Shipment Creation & “My Shipments” List
- Summary: After booking, shipments are created and users can see My Shipments with filters and paging on all devices.
- Services: shipment-service, booking-service, bff
- Apps/Modules: /apps/web-frontend/src/features/shipments/list/*; /apps/mobile-app/src/screens/Shipments/*; /apps/bff/src/routes/shipments/*

Additional implementation notes:
Design filters (status, date range, mode) to map cleanly to OpenSearch queries and ensure mobile-friendly list UX.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-006 – Shipment Detail & Tracking Timeline
Feature ID: F-006
Name: Shipment Detail & Tracking Timeline
Summary: Shipment detail screen with tracking timeline, documents, activity/messages, on all devices.
Services: shipment-service, provider-gateway-service, document-service, notification-service
Apps/Modules: /apps/web-frontend/src/features/shipments/detail/*; /apps/mobile-app/src/screens/ShipmentDetail/*; /apps/bff/src/routes/shipments/*
Key APIs & Contracts:
GET /shipments/{id}; GET /documents?shipmentId=...
Key Events:
ShipmentStatusUpdated, ShipmentDocumentAdded
Implementation Checklist:
1. Ingest tracking events from provider-gateway-service into shipment-service.
2. Build shipment timeline data model and API.
3. Integrate document-service for labels, invoices, customs docs.
4. Build shipment detail UI (timeline + docs) for web and mobile.
5. Add tests for event ingestion and timeline correctness.
Cursor Prompt for F-006
You are implementing feature F-006 – "Shipment Detail & Tracking Timeline" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-006
- Name: Shipment Detail & Tracking Timeline
- Summary: Shipment detail screen with tracking timeline, documents, activity/messages, on all devices.
- Services: shipment-service, provider-gateway-service, document-service, notification-service
- Apps/Modules: /apps/web-frontend/src/features/shipments/detail/*; /apps/mobile-app/src/screens/ShipmentDetail/*; /apps/bff/src/routes/shipments/*

Additional implementation notes:
Pay attention to ordering and de-duplication of tracking events; ensure timezone handling complies with NFRs.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-007 – Tasks & Guidance Panel
Feature ID: F-007
Name: Tasks & Guidance Panel
Summary: Contextual tasks (tips, checks, actions) shown in the right-side panel on desktop and as bottom sheet on mobile across Search, Booking, Shipments.
Services: task-service, booking-service, shipment-service
Apps/Modules: /apps/web-frontend/src/features/tasks/*; /apps/mobile-app/src/components/Tasks/*; /apps/bff/src/routes/tasks/*
Key APIs & Contracts:
GET /tasks?context=booking&mode=air; POST /tasks/{id}/complete
Implementation Checklist:
1. Define task model and rules for context selection.
2. Implement task-service APIs.
3. Integrate with BFF and surface tasks in booking and shipment contexts.
4. Implement task panel UI for desktop (right panel) and mobile (bottom sheet).
5. Add tests for rule evaluation and basic UI interactions.
Cursor Prompt for F-007
You are implementing feature F-007 – "Tasks & Guidance Panel" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-007
- Name: Tasks & Guidance Panel
- Summary: Contextual tasks (tips, checks, actions) shown in the right-side panel on desktop and as bottom sheet on mobile across Search, Booking, Shipments.
- Services: task-service, booking-service, shipment-service
- Apps/Modules: /apps/web-frontend/src/features/tasks/*; /apps/mobile-app/src/components/Tasks/*; /apps/bff/src/routes/tasks/*

Additional implementation notes:
Keep task evaluation stateless and data-driven where possible so configuration can evolve without code changes.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-008 – Notifications Center (email, in-app, push)
Feature ID: F-008
Name: Notifications Center (email, in-app, push)
Summary: All notifications (booking confirmations, status updates, account changes) are delivered via email, in-app, and push for mobile.
Services: notification-service
Apps/Modules: /apps/web-frontend/src/features/notifications/*; /apps/mobile-app/src/screens/Notifications/*; /apps/bff/src/routes/notifications/*
Key APIs & Contracts:
GET /notifications?userId=...; external integrations for email and push
Key Events:
NotificationSent, NotificationFailed
Implementation Checklist:
1. Implement templated notification sending in notification-service.
2. Subscribe notification-service to key domain events.
3. Implement in-app notification listing and read status.
4. Integrate push notifications for mobile via FCM/APNs.
5. Add tests for event-to-notification mapping and email/push invocations.
Cursor Prompt for F-008
You are implementing feature F-008 – "Notifications Center (email, in-app, push)" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-008
- Name: Notifications Center (email, in-app, push)
- Summary: All notifications (booking confirmations, status updates, account changes) are delivered via email, in-app, and push for mobile.
- Services: notification-service
- Apps/Modules: /apps/web-frontend/src/features/notifications/*; /apps/mobile-app/src/screens/Notifications/*; /apps/bff/src/routes/notifications/*

Additional implementation notes:
Ensure notification payloads sent to push providers do not contain sensitive PII; fetch details on app open.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-009 – Account – Company Profile & KYC
Feature ID: F-009
Name: Account – Company Profile & KYC
Summary: Manage company profile, legal details, and upload required KYC documents.
Services: profile-service, document-service, organization-service
Apps/Modules: /apps/web-frontend/src/features/account/profile/*; /apps/mobile-app/src/screens/Account/Profile/*; /apps/bff/src/routes/account/profile/*
Key APIs & Contracts:
GET /orgs/{id}/profile; PUT /orgs/{id}/profile; POST /documents; GET /documents?orgId=...
Implementation Checklist:
1. Implement profile data model and APIs in profile-service.
2. Integrate document-service for KYC uploads.
3. Build account/profile screens for web and mobile.
4. Add tests for validation and upload workflows.
Cursor Prompt for F-009
You are implementing feature F-009 – "Account – Company Profile & KYC" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-009
- Name: Account – Company Profile & KYC
- Summary: Manage company profile, legal details, and upload required KYC documents.
- Services: profile-service, document-service, organization-service
- Apps/Modules: /apps/web-frontend/src/features/account/profile/*; /apps/mobile-app/src/screens/Account/Profile/*; /apps/bff/src/routes/account/profile/*

Additional implementation notes:
Remember to comply with data retention and access control rules for legal and KYC documents.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-010 – Account – Commodities Templates
Feature ID: F-010
Name: Account – Commodities Templates
Summary: Users can save commodities to reuse in future quotes.
Services: commodity-service
Apps/Modules: /apps/web-frontend/src/features/account/commodities/*; /apps/mobile-app/src/screens/Account/Commodities/*; /apps/bff/src/routes/account/commodities/*
Key APIs & Contracts:
GET /commodities; POST /commodities; PUT /commodities/{id}; DELETE /commodities/{id}
Implementation Checklist:
1. Implement commodity CRUD APIs in commodity-service.
2. Integrate commodities into search forms (prefill goods from template).
3. Build commodities management UI on web and mobile.
4. Add tests for CRUD operations and integration with search.
Cursor Prompt for F-010
You are implementing feature F-010 – "Account – Commodities Templates" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-010
- Name: Account – Commodities Templates
- Summary: Users can save commodities to reuse in future quotes.
- Services: commodity-service
- Apps/Modules: /apps/web-frontend/src/features/account/commodities/*; /apps/mobile-app/src/screens/Account/Commodities/*; /apps/bff/src/routes/account/commodities/*

Additional implementation notes:
Make sure commodity templates are scoped by org and visible to appropriate roles only.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-011 – Referrals & Credits
Feature ID: F-011
Name: Referrals & Credits
Summary: Users can invite others and get credits, which are applied in the booking payment breakdown.
Services: referral-service, payment-service
Apps/Modules: /apps/web-frontend/src/features/account/referrals/*; /apps/mobile-app/src/screens/Account/Referrals/*; /apps/bff/src/routes/account/referrals/*
Key APIs & Contracts:
POST /referrals/generate-link; GET /referrals/me; GET /credits; internal credit application in payment-service
Implementation Checklist:
1. Implement referral tracking and credit granting logic.
2. Implement credit model and application during payment calculation.
3. Build referral and credit balance UI for web and mobile.
4. Add tests for credit application and referral flows.
Cursor Prompt for F-011
You are implementing feature F-011 – "Referrals & Credits" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-011
- Name: Referrals & Credits
- Summary: Users can invite others and get credits, which are applied in the booking payment breakdown.
- Services: referral-service, payment-service
- Apps/Modules: /apps/web-frontend/src/features/account/referrals/*; /apps/mobile-app/src/screens/Account/Referrals/*; /apps/bff/src/routes/account/referrals/*

Additional implementation notes:
Align referral and credit business rules with finance and legal; if rules change significantly, add or update ADRs.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-012 – Admin Backoffice & Marketplace Operations
Feature ID: F-012
Name: Admin Backoffice & Marketplace Operations
Summary: A comprehensive backoffice portal for platform administrators to manage users, organizations, bookings, financials, content, and system configuration.
Services: admin-service, organization-service, booking-service, payment-service, shipment-service, document-service
Apps/Modules: /apps/web-frontend/src/features/admin/*; /apps/bff/src/routes/admin/*
Key APIs & Contracts:
GET /admin/dashboard/stats; GET /admin/orgs; PATCH /admin/orgs/{id}/status; GET /admin/bookings; POST /admin/bookings/{id}/intervene; GET /admin/financials/reports; POST /admin/cms/banners
Key Events:
OrganizationStatusChanged, AdminActionLogged, BookingInterventionPerformed, ContentPublished
Implementation Checklist:
1.  **Dashboard**: Implement high-level metrics (GMV, Active Users, Booking Volume, Revenue).
2.  **User & Org Management**:
    *   **User Management**:
        *   **List**: View all users with pagination and search.
        *   **Create**: Admin can create new users directly.
        *   **Edit**: Update user details (name, email, role).
        *   **Delete**: Permanently remove users.
        *   **Security**: Admin can reset user passwords.
        *   **Status**: Block/Unblock users (prevent login).
    *   **Org Management**:
        *   **List**: View organizations as cards.
        *   **Actions**: Each card has a dropdown menu to Modify, Delete, Block, and Unblock.
        *   **Create**: Ability to create new organizations.
        *   **Detail**: Click card to view organization details and associated users.
        *   **Org Users**:
            *   List all users in the organization.
            *   **Add User**: Button to create a new user directly in this organization.
            *   **User Actions**: Edit button per user triggering a pop-up menu/modal to:
                *   Edit details (Email, Role, Password).
                *   Delete user.
                *   Block/Unblock user.
        *   KYC/KYB verification workflow.
3.  **Marketplace Operations**:
    *   **Booking Management**: View all bookings, filter by status/provider.
    *   **Dispute Resolution**: Ability to cancel bookings, issue refunds, or manually update status.
    *   **Shipment Oversight**: View tracking timelines and documents for any shipment.
4.  **Financial Management**:
### 4. Financials
**Goal**: Track revenue, manage transactions, and generate invoices.

**Requirements**:
-   **Dashboard**:
    -   Display "Total Revenue" (sum of all successful payments).
    -   Display "Transaction Count".
-   **Transactions**:
    -   List all transactions with details: ID, Type (Payment/Refund), Amount, Currency, Status (Success/Pending/Failed), Reference (Stripe ID), Date.
    -   Filter by status or date range.
-   **Invoices**:
    -   List all invoices generated from bookings.
    -   Allow downloading invoices as PDF (future scope).
    -   Status tracking (Paid/Unpaid/Overdue).
-   **Integration**:
    -   Automatically create a Transaction and Invoice record upon successful booking confirmation.
    -   Link financial records to the specific Booking and User Organization.

### 5. CMS (Content Management System)
**Goal**: Manage dynamic content displayed on the platform without code changes.

**Requirements**:
-   **Content Types**: Support for Announcements, Homepage Banners, and Help Articles.
-   **Management UI**:
    -   List view of all content items with status (Draft/Published).
    -   Create/Edit/Delete functionality.
    -   Rich text support for body content (future scope).
-   **Publishing Workflow**:
    -   Draft mode for work-in-progress content.
    -   Published mode for live content visible to users.

### 6. Master Data Management
**Goal**: Centralized management of reference data used across the platform.

**Requirements**:
-   **Locations**:
    -   Manage Ports and Airports (Code, Name, Country, Type).
    -   Used for booking search and shipment routing.
-   **Commodities**:
    -   Manage list of shippable goods.
    -   Flag restricted items (e.g., Hazardous Materials) to trigger compliance checks.
-   **CRUD Operations**: Full Create, Read, Update, Delete capabilities for Admins.
7.  **Audit Logging**:
    *   View immutable logs of all admin actions (who did what, when).
8.  **Access Control**:
    *   Granular RBAC for admin roles (e.g., Super Admin, Support Agent, Finance Manager).

Cursor Prompt for F-012
You are implementing feature F-012 – "Admin Backoffice & Marketplace Operations" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-012
- Name: Admin Backoffice & Marketplace Operations
- Summary: A comprehensive backoffice portal for platform administrators to manage users, organizations, bookings, financials, content, and system configuration.
- Services: admin-service, organization-service, booking-service, payment-service, shipment-service, document-service
- Apps/Modules: /apps/web-frontend/src/features/admin/*; /apps/bff/src/routes/admin/*

Additional implementation notes:
- **UX/UI Separation**: The Admin Backoffice MUST be a distinct environment (e.g., `/admin` route with a completely different layout/theme or a separate app) to prevent confusion with the main Marketplace UI. It should not share the standard buyer/seller navigation.
- **Security**: Ensure strict RBAC. Only users with specific ADMIN roles can access these endpoints.
- **Audit**: Every state change initiated from the backoffice MUST be logged to the audit trail.
- **UX**: Use a dense, data-heavy UI layout (tables with filters) suitable for power users.

Follow the generic steps from the Feature Prompt Template (Section 3).
F-013 – Multi-Device Parity for Core Flows
Feature ID: F-013
Name: Multi-Device Parity for Core Flows
Summary: Ensure core flows (Search → Results → Booking → Shipment detail, My Shipments, Account basics) exist and are usable on desktop web, mobile web, and mobile app.
Services: All core services and apps
Apps/Modules: All core web and mobile features
Implementation Checklist:
1. Audit existing implementations of F-001 to F-006 on web and mobile.
2. For any missing mobile implementation, create tasks to add mobile support or add ADR documenting exceptions.
3. Ensure navigation flows work end-to-end on mobile app.
4. Add mobile UI tests and, if tooling allows, a basic mobile E2E flow.
5. Update ADRs if you decide on any permanent deviations from parity.
Cursor Prompt for F-013
You are implementing feature F-013 – "Multi-Device Parity for Core Flows" for VEYOR Marketplace.

Context docs:
- docs/frd/marketplace-frd.md
- docs/architecture/01-context-and-goals.md
- docs/architecture/02-domain-and-services.md
- docs/architecture/03-integrations-and-contracts.md
- docs/architecture/04-nfr-and-observability.md
- docs/architecture/05-test-strategy-and-quality-gates.md
- docs/architecture/06-feature-spec-and-implementation-plan.md
- docs/constraints/architecture-guardrails.md
- docs/constraints/coding-standards-guardrails.md
- docs/adr/adr-index.json (+ relevant ADRs)

Feature details:
- ID: F-013
- Name: Multi-Device Parity for Core Flows
- Summary: Ensure core flows (Search → Results → Booking → Shipment detail, My Shipments, Account basics) exist and are usable on desktop web, mobile web, and mobile app.
- Services: All core services and apps
- Apps/Modules: All core web and mobile features

Additional implementation notes:
Treat this as a cross-cutting quality feature: it should be revisited regularly as new features are added.

Follow the generic steps from the Feature Prompt Template (Section 3).

---

## 14. Implementation Status (as of January 2026)

This section tracks the implementation status of features in the current Modular Monolith architecture.

### Feature Implementation Matrix

| Feature ID | Feature Name | Backend | Frontend | Admin | Status |
|------------|--------------|---------|----------|-------|--------|
| F-001 | Quote Search & Recommended | ✅ | ✅ | N/A | **Implemented** |
| F-002 | Quote Results & Filtering | ✅ | ✅ | N/A | **Implemented** |
| F-003 | Booking & Verification | ✅ | ✅ | ✅ | **Implemented** |
| F-004 | Payment & Billing | ✅ | ✅ | ✅ | **Implemented** |
| F-005 | Shipment Creation & List | ✅ | ✅ | ✅ | **Implemented** |
| F-006 | Shipment Detail & Tracking | ✅ | ✅ | N/A | **Implemented** |
| F-007 | Tasks & Guidance Panel | ⚠️ | ⚠️ | N/A | **Partial** |
| F-008 | Notifications Center | ✅ | ✅ | ✅ | **Implemented** |
| F-009 | Company Profile & KYC | ⚠️ | ⚠️ | N/A | **Partial** |
| F-010 | Commodities Templates | ✅ | ✅ | N/A | **Implemented** |
| F-011 | Referrals & Credits | ✅ | ✅ | N/A | **Implemented** |
| F-012 | Admin Backoffice | ✅ | ✅ | ✅ | **Implemented** |
| F-013 | Multi-Device Parity | ⚠️ | ⚠️ | N/A | **Partial** |

### Legend
- ✅ **Implemented**: Core functionality is complete and tested
- ⚠️ **Partial**: Basic structure exists, needs enhancement
- ❌ **Not Started**: No implementation yet

### Recent Architecture Changes (v2.0 Modernization)

1. **Modular Structure**: Backend reorganized into domain modules (`identity`, `booking`, `catalog`, `finance`, `shipping`, `crm`, `content`)
2. **CI/CD Pipeline**: GitHub Actions for automated build/test
3. **Database Migrations**: Flyway for schema versioning
4. **Caching Layer**: Redis + Spring Cache for tariffs/commodities
5. **Async Processing**: Spring Async + Kafka for event-driven patterns
6. **Observability**: Actuator endpoints + Prometheus metrics

### Admin Portal Features (F-012) - Detailed Status

| Sub-Feature | Status | Notes |
|-------------|--------|-------|
| Dashboard Stats | ✅ | GMV, Users, Bookings, Revenue |
| Organizations List | ✅ | CRUD + Status toggle |
| Organization Users | ✅ | View, Add, Edit, Delete users |
| User Shipments Modal | ✅ | View shipments per user |
| Bookings List | ✅ | All bookings with filters |
| Financials | ⚠️ | Basic stats, transactions list |
| CMS | ⚠️ | Basic content CRUD |
| Master Data | ⚠️ | Locations, commodities CRUD |
| Freighty Agent Demo | ✅ | Demo module for AI alerting |
