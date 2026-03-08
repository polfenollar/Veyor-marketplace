# Security and credentials (pre–public GitHub)

This document lists where credentials and secrets appear and how the repo is kept safe to publish.

## Implemented safeguards

- **infra/docker-compose.yml** – Top-of-file comment states default credentials are for local development only.
- **backend** – `application-local.properties` is gitignored and no longer tracked. Use `application-local.properties.example` as template; copy to `application-local.properties` and set your local DB password.
- **agents** – `.env` is gitignored. `agents/.env.example` has a warning header; `agents/README.md` instructs not to commit `.env` and to rotate keys if leaked.

## Critical: do before making the repo public

### 1. **agents/.env – real API key**

- **Location:** `agents/.env`
- **Content:** May contain a real `OPENAI_API_KEY` (sk-proj-...). This file is in `.gitignore` and is **not** tracked by git.
- **Action:**
  - **Do not** add `agents/.env` to git. It is already ignored.
  - **Rotate the OpenAI API key** at https://platform.openai.com/api-keys (revoke the current one and create a new one) so that if the key ever leaked, it is no longer valid.
  - After publishing, contributors copy `agents/.env.example` to `agents/.env` and fill in their own keys.

### 2. **Frontend and NextAuth**

- **frontend/.env.local** – Ignored by git. Contains `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_FLAGSMITH_ID`. `NEXT_PUBLIC_*` vars are bundled in the client; the Flagsmith ID is typically a public client identifier. No secret in the repo; keep `.env.local` uncommitted.
- **frontend/app/api/auth/[...nextauth]/route.ts** – Uses `process.env.KEYCLOAK_CLIENT_SECRET`. Secret must be set via environment (e.g. `.env.local`), not hardcoded. No change needed if you never commit `.env.local`.

---

## Tracked files with dev/default credentials

### 3. **infra/docker-compose.yml**

- `POSTGRES_USER` / `POSTGRES_PASSWORD`: `veyor` / `veyor`
- `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`: `admin` / `admin`
- Grafana: `GF_SECURITY_ADMIN_USER` / `GF_SECURITY_ADMIN_PASSWORD`: `admin` / `admin`

A comment at the top of the file states these are for local development only.

### 4. **backend/src/main/resources/application-local.properties**

- **No longer tracked.** This file is in `backend/.gitignore`. A template exists at `application-local.properties.example`. Copy it to `application-local.properties` and set `spring.datasource.password` (and optionally username) for local runs.

---

## Low risk / acceptable for public

- **backend/src/test/resources/application.properties** – H2 in-memory test DB; `password=` is empty. Standard and safe.
- **E2E test** `_backup_before_modernization/frontend/tests/e2e/admin-user-shipments.spec.ts` – Uses `admin123` as a test user password. Acceptable for a test fixture.
- **reference_implementation/vite.config.ts** – Uses `env.GEMINI_API_KEY` from environment; no key in source.
- **Bearer token usage** – Components use `token` from auth context or `localStorage.getItem('token')` for API calls; no hardcoded tokens.

---

## Checklist before publishing

- [ ] Confirm `agents/.env` is not tracked: `git status agents/.env` (should be “ignored” or untracked).
- [ ] Rotate the OpenAI API key that is (or was) in `agents/.env`.
- [ ] Ensure no other `.env` or `.env.local` files are committed.
- [x] Comment in `infra/docker-compose.yml` that default credentials are dev-only.
- [x] Backend DB credentials in untracked `application-local.properties`; `application-local.properties.example` committed.
