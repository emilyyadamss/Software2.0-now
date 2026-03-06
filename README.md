# Software2.0-now
This application aims to allow users to see new updates for services and software they would need to build packages for. It would allow users to create dashboards, reminders, etc.

## Quick start (Prisma foundation)

```bash
npm install
cp .env.example .env
# set DATABASE_URL and DIRECT_URL in .env
npm run db:check
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

### Supabase troubleshooting
- If you see `P1000` / `Authentication failed`, your DB username/password is incorrect.
- For pooled Supabase URLs, username should look like `postgres.<PROJECT_REF>`.
- Keep `sslmode=require` on both URLs.

This repository now includes:
- `prisma/schema.prisma` — multi-tenant MVP data model
- `prisma/seed.ts` — starter app catalog seed data (10 common apps)
- `package.json` scripts for Next.js + Prisma
- `src/app/api/...` tenant-aware API scaffolding for:
  - `GET /api/apps`
  - `GET /api/tenant/apps`
  - `POST /api/tenant/apps/:id/enable`
  - `POST /api/tenant/apps/:id/disable`
  - `GET /api/dashboard/summary`


0) Target MVP (what “done” means)
  A tenant admin can:
  Sign in with SSO
  Select supported apps for their enterprise
  See only those apps on a dashboard
  View update status (current vs latest)
  Create a basic “patch package job” record
  Get reminder notifications for critical updates

1) Suggested architecture (simple + scalable)
  Frontend: Next.js (App Router) + Tailwind + shadcn/ui
  Backend API: Next.js API routes or separate NestJS service (if you want cleaner long-term separation)
  DB: PostgreSQL
  ORM: Prisma
  Queue/Jobs: BullMQ + Redis
  Auth: NextAuth + Azure AD/Okta SSO
  Hosting: Vercel (web) + Railway/Render/Fly (API/worker/Redis/Postgres)
  If your repo is already in another stack, keep the stack and just adopt the same domain model below.

3) Core data model (first schema)
  Use these tables first:
  tenants (id, name, slug, plan, created_at)
  users (id, email, name)
  tenant_memberships (tenant_id, user_id, role: admin/operator/viewer)
  applications (id, name, vendor, category, homepage, installer_type, detection_rule)
  application_versions (id, application_id, version, released_at, source_url, checksum)
  tenant_applications (tenant_id, application_id, is_enabled, update_ring, auto_approve)
  assets (id, application_version_id, file_url, silent_args, install_script)
  update_events (id, application_id, old_version, new_version, severity, detected_at)
  package_jobs (id, tenant_id, application_version_id, status, started_at, finished_at, log_url)
  notifications (id, tenant_id, type, title, body, sent_at, channel)
  That’s enough for multi-tenant scoping + dashboards + job tracking.

3) API endpoints (MVP)
  POST /api/auth/sso/callback
  GET /api/me
  GET /api/tenant/current
  GET /api/apps (global catalog)
  GET /api/tenant/apps (scoped enabled apps only)
  POST /api/tenant/apps/:id/enable|disable
  GET /api/updates (tenant-scoped)
  POST /api/package-jobs
  GET /api/package-jobs/:id
  POST /api/reminders
  GET /api/dashboard/summary
  Guard every tenant endpoint with tenant_id from membership context (never trust raw query param alone).

5) First 4 screens
  Login / Org Select
  Dashboard
  Outdated apps count
  Critical updates
  Failed jobs
  App Catalog
  Search/filter
  Enable/disable per tenant
  Jobs + Update Feed
  Recent package jobs
  Update events timeline

5) Build order (tickets)

  Sprint 1 — Foundation
  Bootstrap env + CI + lint + format
  Prisma schema + migrations
  SSO login + role middleware
  Seed global application catalog
  
  Sprint 2 — Tenant app scoping
  Tenant app enable/disable API
  Scoped app catalog UI
  Dashboard summary widgets (real DB data)
  
  Sprint 3 — Update ingestion
  Worker service with scheduled polling
  Ingest 5–10 apps first (Chrome, Zoom, 7-Zip, VS Code, Notepad++)
  Create update_events when new versions appear
  
  Sprint 4 — Package workflow
  Create package job records
  Job states (queued/running/success/failed)
  Logs + retry button
  
  Sprint 5 — Notifications
  Reminder rules (critical/new major version)
  Email/Teams webhook (start with one channel)
  
6) Security + enterprise essentials (don’t skip)
  Tenant row-level scoping on every query
  Audit logs for admin actions
  Secrets in managed vault/env, never in repo
  Signed artifact URLs and checksum tracking
  Basic rate limiting + input validation (zod)

7) What to put in your GitHub issues right now
  Create 10 starter issues:
  Multi-tenant DB schema
  SSO integration
  Role-based middleware
  App catalog seed/import
  Tenant app preferences UI
  Update polling worker
  Update events API
  Dashboard widgets
  Package jobs model + API
  Notification rules + delivery
