# Quality Inspection Tracker

A mobile-first Quality Inspection Tracker for shop-floor supervisors. It replaces paper defect registers with a simple workflow to log, track, import, and resolve quality inspections.

## Setup

### Option 1: Run with Docker Compose

#### Prerequisites

- Docker Desktop installed and running
- Git installed

Ensure no other application is using these ports:

```text
3001 - Auth Service
3002 - Inspection Tracker Service
5173 - Frontend
```

PostgreSQL and Redis run internally in Docker, so ports `5432` and `6379` do not need to be free on your machine.

#### Steps

```bash
git clone <your-repository-url>
cd Microservices_demo
docker compose up --build
```

Open:

```text
http://localhost:5173
```

To stop the application:

```bash
docker compose down
```

To reset all Docker data, including PostgreSQL data:

```bash
docker compose down -v
```

Use the reset command only when you intentionally want to remove all saved data.

### Seeded Login Users

| Name         | Email                | Password | Role       |
| ------------ | -------------------- | -------- | ---------- |
| Jay Thakkar  | jaythakkar@mail.com  | jay@123  | Supervisor |
| Tanmay Shah  | tanmayshah@mail.com  | ts@123   | Supervisor |
| Charul Patel | charulpatel@mail.com | cp@123   | Supervisor |

### Option 2: Run Without Docker

#### Prerequisites

Install or run the following services locally:

- Node.js
- PostgreSQL
- Redis

Create a PostgreSQL database:

```text
quality_tracker
```

Enable UUID generation:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

#### 1. Start Auth Service

```bash
cd auth_service
npm install
npm run dev
```

Example `.env`:

```env
PORT=3001
DATABASE_URL=postgresql://quality_user:quality_password@localhost:5432/quality_tracker
JWT_SECRET=local-development-secret
JWT_EXPIRES_IN=1h
NODE_ENV=development
LOG_LEVEL=info
```

#### 2. Start Inspection Tracker Service

```bash
cd inspection_tracker_service
npm install
npm run dev
```

Example `.env`:

```env
PORT=3002
DATABASE_URL=postgresql://quality_user:quality_password@localhost:5432/quality_tracker
REDIS_URL=redis://localhost:6379
AUTH_SERVICE_URL=http://localhost:3001
NODE_ENV=development
LOG_LEVEL=info
```

#### 3. Start Frontend

```bash
cd front-end
npm install
npm run dev
```

Example `.env`:

```env
VITE_AUTH_API_URL=http://localhost:3001
VITE_INSPECTION_API_URL=http://localhost:3002
```

Open:

```text
http://localhost:5173
```

## Technology Stack

- Frontend: React, TypeScript, Redux Toolkit, Axios
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Sequelize ORM
- Cache: Redis
- Authentication: JWT
- Local container setup: Docker Compose

## Project Structure

```text
Microservices_demo/
├── auth_service/
├── inspection_tracker_service/
├── front-end/
├── database/
│   └── init/
│       └── 01_pgcrypto.sql
├── defects.csv
├── docker-compose.yml
└── README.md
```

## Features

- JWT-based login
- Automatic logout when a JWT expires
- Log an inspection from a mobile-friendly form
- Machine, defect type, and severity selection
- Filter inspections by machine, severity, status, and date range
- Resolve an inspection with a mandatory resolution note
- Summary of open and resolved inspections by severity
- Import defects from `.csv`, `.xls`, or `.xlsx` files
- Redis token validation cache
- Seeded users, machines, and defect types

## File Import Format

Accepted file types:

```text
.csv
.xls
.xlsx
```

Use these exact headers:

```text
date,machineName,defectType,severity,remarks
```

Example:

```csv
date,machineName,defectType,severity,remarks
14-10-2026,Machine-101,Weave Defect,Major,Loose threads near edge
14-10-2026,Machine-102,Shade Variation,Minor,Colour variation observed
```

Rules:

- Date format must be `dd-mm-yyyy`.
- Future dates are skipped.
- Invalid dates are skipped.
- Unknown machines are skipped.
- Unknown defect types are skipped.
- Severity must be `Critical`, `Major`, or `Minor`.
- Valid rows are added even if other rows in the same file are skipped.
- The response includes `addedCount` and `skippedCount`.

### Test Import File

The project root includes a sample file named `defects.csv`.

Use this file to test the defect-import functionality. Upload it through the import feature, or send it as the `file` field to:

```text
POST /api/inspections/import
```

## Seeded Reference Data

```text
Machines:
- Machine-101
- Machine-102
- Machine-201

Defect types:
- Weave Defect
- Shade Variation
- Hole/Tear
- Count Deviation
- Other

Severities:
- Critical
- Major
- Minor
```

## Main API Endpoints

| Method | Endpoint                         | Description                                |
| ------ | -------------------------------- | ------------------------------------------ |
| POST   | `/api/auth/login`                | Login and receive a JWT                    |
| GET    | `/api/auth/validate`             | Validate a JWT                             |
| GET    | `/api/inspections/metadata`      | Get machines, defect types, and severities |
| POST   | `/api/inspections`               | Create an inspection                       |
| GET    | `/api/inspections`               | List and filter inspections                |
| PATCH  | `/api/inspections/:id/resolve`   | Resolve an inspection                      |
| GET    | `/api/inspections/summary`       | Get open and resolved counts by severity   |
| POST   | `/api/inspections/importDefects` | Import inspections from a file             |

All API responses use a consistent `data` wrapper.

## Architecture Decisions

### Separate Auth and Inspection Services

Authentication and inspection workflows are separated into two services. The Auth Service owns login and JWT validation. The Inspection Tracker Service owns inspection creation, filtering, imports, summaries, and resolution.

### Shared PostgreSQL Database

Both services use one PostgreSQL database to keep local setup simple. Tables are logically owned by their respective services:

```text
Auth Service:
- users
- roles

Inspection Tracker Service:
- inspections
- machines
- defect_types
```

A production system could move toward separate databases or schemas if stronger service independence is needed.

### Redis Token Cache

The Inspection Tracker Service caches validated JWT details in Redis. On a cache hit, it authorizes the request without calling Auth Service. On a cache miss, it calls the Auth Service validation endpoint and caches the result until the JWT expiry time.

### JWT Authentication

The frontend stores the JWT after login and sends it through the `Authorization` header for protected requests. It automatically logs out the user when the token expires. Backend services still perform final token validation.

### Mobile-First Frontend

The UI is designed for narrow screens, including a 390px-wide phone browser. Forms, filters, buttons, inspection cards, and resolution controls stack vertically for easier use.

### Seed Data and Database Setup

Sequelize creates tables when backend services start. Seed functions add users, machines, and defect types. Docker initializes PostgreSQL with the `pgcrypto` extension so UUID generation works on a fresh setup.

## Assumptions

- All seeded users have the `Supervisor` role.
- Any authenticated supervisor can log and resolve inspections.
- Machines and defect types are managed as reference data.
- File import does not create machines or defect types. Unknown values are skipped.
- Import dates use `dd-mm-yyyy`.
- JWT refresh tokens are not implemented. Users must log in again after expiry.
- The application is intended for internal use and local deployment.

## What I Would Do With More Time

- Add registration, email verification, password reset, and OTP-based account activation.
- Build full-fledged mobile and desktop applications for the same Quality Inspection Tracker workflow.
- Add an admin panel to manage users, roles, machines, and defect types.
- Replace `sequelize.sync()` with versioned database migrations.
- Add refresh tokens and token revocation.
- Show skipped file-import row numbers and specific failure reasons.
- Add unit, integration, and end-to-end tests.
- Add pagination and chunked processing for large data sets.
- Add offline inspection logging and automatic synchronization.
- Add CI/CD, rate limiting, audit trails, and production monitoring.
