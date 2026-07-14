# HostelOS

HostelOS is a secure, role-aware hostel operations platform for admissions, allocation, fees, attendance, leave, visitors, mess, complaints, inventory, staff, notices and reporting.

## Run locally

1. Copy `.env.example` to `.env` and set secrets and service credentials.
2. Install dependencies: `npm install`.
3. Start MongoDB, then run `npm run dev`.
4. Open `http://localhost:5173`. Register the first administrator from the sign-up screen.

## Production

Run `docker compose up --build`. Configure a production MongoDB URI, HTTPS, `COOKIE_SECURE=true`, strong JWT secrets, SMTP, Cloudinary and payment keys before release.

## Architecture

`client` is a Vite React dashboard. `server` uses Express MVC with service/repository-style resource access, JWT access/refresh rotation, validation, audit records, rate limiting and a consistently paginated REST API. Every domain route is role protected.
