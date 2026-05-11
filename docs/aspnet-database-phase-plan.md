# HantaWorld ASP.NET + MSSQL Phase Plan

## Target Architecture

`Vercel frontend -> ASP.NET Core API/Admin on Inetmar/Plesk -> MSSQL (localhost)`

Reason:

- Vercel cannot reach a localhost-only MSSQL instance on Inetmar.
- The API and admin panel must run on the same hosting environment as the database.
- The frontend should consume only public JSON endpoints, never the database directly.

## Recommended Backend Stack

Use `ASP.NET Core 8 MVC + Web API` as the default target.

Why `net8.0`:

- .NET 8 is LTS.
- It is the safest hosting target for a Plesk/shared Windows environment.
- It supports MVC, cookie auth, API controllers, validation, and modern security defaults.

Suggested project shape:

```text
backend/
├── HantaWorld.AdminApi.sln
├── src/
│   ├── HantaWorld.AdminApi/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   ├── Admin/
│   │   │   └── Auth/
│   │   ├── Data/
│   │   ├── Domain/
│   │   ├── Services/
│   │   ├── Security/
│   │   ├── Views/
│   │   └── wwwroot/
│   └── HantaWorld.AdminApi.Tests/
└── deploy/
    ├── web.config
    └── publish.ps1
```

Recommended runtime split:

- MVC/Razor views for admin login and CRUD pages
- API controllers for frontend JSON endpoints
- Entity Framework Core with SQL Server provider
- Cookie authentication for admin
- Optional server-side output caching for public read endpoints

## Database Design Notes

Primary tables requested and included:

- `countries`
- `outbreaks`
- `articles`
- `sources`
- `admin_users`
- `audit_logs`

Supporting join tables added because they are operationally necessary:

- `outbreak_sources`
- `article_sources`
- `article_tags`

Why the join tables matter:

- An outbreak can have multiple citations.
- An article can have multiple citations.
- Source traceability should not be collapsed into one flat field only.

Schema file:

- [database/01_mssql_schema.sql](/abs/path/C:/Users/Ceyda/.gemini/antigravity/scratch/hantaworld/database/01_mssql_schema.sql)

## Core Domain Rules

### Outbreaks

Must support:

- country linkage
- status: `confirmed | suspected | monitoring | resolved`
- severity: `critical | high | medium | low`
- verification status: `verified | pending | unverified | rejected`
- publication status: `draft | published | archived`
- geolocation
- counts and growth
- source traceability

### Articles / Reports

Must support:

- optional outbreak linkage
- optional country linkage
- category
- full content
- verification status
- publish/draft status
- multi-source citations

### Admin Users

Must support:

- role-based access
- active/inactive state
- lockout support
- hashed passwords only

### Audit Logs

Must record:

- who changed data
- what entity changed
- old values
- new values
- request path and method
- timestamp

## Public API Contract

All public endpoints should be read-only and return only `published + verified` content unless there is a deliberate reason otherwise.

### `GET /api/outbreaks`

Returns:

- outbreak list for the map/dashboard
- country summary fields
- numeric metrics
- source/citation metadata

Recommended shape:

```json
[
  {
    "id": "o-hondius-2026",
    "slug": "mv-hondius-cluster",
    "title": "MV Hondius Cluster",
    "country": {
      "slug": "mv-hondius-cluster",
      "name": "Multi-Country (MV Hondius Cluster)",
      "isoCode": "MULTI",
      "flagEmoji": "🚢"
    },
    "status": "confirmed",
    "severityLevel": "critical",
    "verificationStatus": "verified",
    "confirmedCases": 5,
    "suspectedCases": 3,
    "deaths": 3,
    "recovered": 0,
    "growthRate": 14.3,
    "coordinates": { "lat": -54.5, "lng": -36.5, "radiusKm": 50 },
    "publicationDate": "2026-05-07",
    "lastVerifiedDate": "2026-05-07",
    "verificationNotes": "...",
    "confidenceScore": 95,
    "sourceUrl": "https://..."
  }
]
```

### `GET /api/countries`

Returns:

- countries used by detail pages and watchlist
- optionally include computed outbreak counters

### `GET /api/news`

Returns:

- published verified articles only
- excerpt, category, dates, confidence, primary source
- optionally full content with `?includeContent=true`

### `GET /api/sources`

Returns:

- source metadata used by admin and frontend attribution

### `GET /api/global-stats`

Returns:

```json
{
  "totalConfirmedCases": 5,
  "totalSuspectedCases": 3,
  "totalDeaths": 3,
  "totalRecovered": 0,
  "affectedCountries": 1,
  "activeOutbreaks": 1,
  "growthRate7d": 14.3,
  "lastUpdated": "2026-05-07T00:00:00Z"
}
```

Implementation note:

- This can be served from `vw_global_stats` or a service query.

## Admin Panel Scope

### 1. Authentication

Pages:

- `/admin/login`
- `/admin/logout`

Requirements:

- secure cookie auth
- anti-forgery on form posts
- brute-force mitigation
- lockout after repeated failed attempts

### 2. Dashboard

Page:

- `/admin`

Widgets:

- total outbreaks
- total published articles
- pending verification count
- most recent audit log events

### 3. Outbreak Management

Pages:

- `/admin/outbreaks`
- `/admin/outbreaks/create`
- `/admin/outbreaks/{id}/edit`

Fields:

- public id
- slug
- title
- country
- summary
- description
- status
- severity level
- verification status
- publication status
- confirmed/suspected/deaths/recovered
- growth rate
- coordinates
- publication date
- last verified date
- verification notes
- confidence score
- source assignments

### 4. News / Report Management

Pages:

- `/admin/articles`
- `/admin/articles/create`
- `/admin/articles/{id}/edit`

Fields:

- public id
- slug
- title
- excerpt
- content
- outbreak relation
- country relation
- category
- verification status
- publication status
- reading time
- confidence score
- publication date
- last verified date
- source assignments
- tags

### 5. Source Management

Pages:

- `/admin/sources`
- `/admin/sources/create`
- `/admin/sources/{id}/edit`

Fields:

- slug
- source name
- organization
- type
- url
- official flag
- reliability score
- notes

### 6. Verification Workflow

Admin behavior:

- draft entries can be saved without public visibility
- verified + published entries become visible to frontend API
- pending/unverified entries stay internal unless a dedicated preview endpoint is later added

### 7. Audit Viewer

Page:

- `/admin/audit-logs`

Should show:

- actor
- entity
- action
- changed at
- old/new JSON

## Security Requirements

### Passwords

Use ASP.NET Core password hashing, not manual SHA256/SHA512.

Recommendation:

- `IPasswordHasher<TUser>` or ASP.NET Identity password hasher

Never do:

- plain text storage
- reversible encryption
- custom homegrown hashing

### Protected Admin Routes

Use:

- `[Authorize]` globally for `/admin/*`
- role policies for destructive actions

Suggested roles:

- `superadmin`
- `admin`
- `editor`
- `analyst`

### Validation

Use:

- DataAnnotations on input models
- FluentValidation optionally, if desired
- server-side validation on every admin post

Validate especially:

- slug uniqueness
- date ordering
- confidence score range
- numeric case counts
- URL format
- publish state transitions

### SQL Injection Protection

Use EF Core and LINQ only for normal CRUD.

If raw SQL is ever needed:

- use parameterized queries only

Never concatenate:

- ids
- search strings
- sort fields from raw request input

### CSRF

For admin forms:

- use anti-forgery tokens

For JSON API:

- keep endpoints read-only for frontend phase 1

### Logging and Secrets

Do not commit:

- Inetmar connection strings
- database passwords
- Plesk publish credentials

Use:

- `appsettings.json` for non-secret defaults
- `appsettings.Production.json` or Plesk environment variables for secrets

## Recommended ASP.NET Layers

### Controllers

`Controllers/Api`

- `OutbreaksController`
- `CountriesController`
- `NewsController`
- `SourcesController`
- `GlobalStatsController`

`Controllers/Admin`

- `AdminDashboardController`
- `AdminOutbreaksController`
- `AdminArticlesController`
- `AdminSourcesController`
- `AdminAuditLogsController`

`Controllers/Auth`

- `AccountController`

### Services

- `OutbreakService`
- `ArticleService`
- `SourceService`
- `CountryService`
- `AuditLogService`
- `PublishingService`

### Data

- `ApplicationDbContext`
- `EntityTypeConfiguration<>` classes
- migrations
- repository pattern optional, not required

## Suggested DTO Split

Use separate models for:

- EF entities
- admin input/view models
- public API response DTOs

Do not return EF entities directly from API.

Reason:

- prevents accidental data leakage
- preserves frontend contract stability
- makes filtering of unpublished fields explicit

## Publish Rules

Recommended rule for public visibility:

- `publication_status = 'published'`
- `verification_status = 'verified'`
- `is_active = 1` where relevant

Recommended rule for admin visibility:

- all records visible according to role

## Suggested Phase Breakdown

### Phase 1. Database + backend skeleton

- create ASP.NET Core 8 solution
- add EF Core SQL Server
- add DbContext + entities
- apply initial migration or run SQL script
- configure production connection string

Deliverable:

- backend app starts locally and connects to MSSQL

### Phase 2. Authentication + admin shell

- login/logout
- auth cookie
- protected `/admin`
- seed first admin user

Deliverable:

- secure admin login works

### Phase 3. CRUD modules

- countries
- sources
- outbreaks
- articles

Deliverable:

- editors can manage all core content

### Phase 4. Publish workflow + audit logging

- publish/draft
- verification statuses
- audit records on create/update/delete/publish

Deliverable:

- full traceability in admin

### Phase 5. Public API

- `/api/outbreaks`
- `/api/countries`
- `/api/news`
- `/api/sources`
- `/api/global-stats`

Deliverable:

- frontend can switch from local JSON to remote API

### Phase 6. Frontend integration

In the Next.js app:

- replace local JSON reads in `lib/data.ts`
- add backend base URL env var
- map API DTOs to current frontend types

Deliverable:

- same UI, database-backed content

## Frontend Migration Strategy

Keep `lib/data.ts` as the integration seam.

Current state:

- local JSON files

Next state:

- server-side `fetch()` to ASP.NET endpoints

This keeps UI churn low and allows gradual rollout.

## Deployment Notes For Inetmar / Plesk

Confirm these items before implementation:

1. Supported .NET hosting runtime on the Plesk server
2. Whether `net8.0` hosting bundle is installed
3. IIS application pool configuration
4. Write permissions for logs and uploads if needed
5. HTTPS binding and custom domain strategy

Recommended deployment model:

- publish backend as IIS-targeted ASP.NET Core app
- run under its own application path or subdomain

Recommended URLs:

- `https://api.hantaworld.com/api/...`
- `https://api.hantaworld.com/admin/...`

If subdomain is not available:

- `https://your-inetmar-domain.com/hantaworld-api/...`

## Immediate Next Build Tasks

Implementation-ready next tasks:

1. Scaffold `backend/HantaWorld.AdminApi` as ASP.NET Core 8 MVC app.
2. Add EF Core SQL Server and map the schema above.
3. Build cookie auth and first admin login flow.
4. Implement admin CRUD for `sources`, `countries`, `outbreaks`, `articles`.
5. Add audit logging middleware/service.
6. Expose the 5 public read endpoints.
7. Switch Next.js `lib/data.ts` to consume the API.

## Recommendation

The cleanest next move is:

- keep this Next.js repo for frontend
- create a sibling `backend/` ASP.NET Core project in the same repo
- use the provided SQL schema as the initial authoritative database contract

If you want, next I can do one of these directly:

1. scaffold the ASP.NET Core backend project structure in this repo
2. generate the EF Core entity classes and `DbContext`
3. build the admin login module first
4. create the public API controllers first
