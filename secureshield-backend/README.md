# SecureShield — Backend (Insurance Management Platform)

Express + Prisma + PostgreSQL. ESM (`"type": "module"`), matches the internship spec exactly.

## Setup

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL and JWT_SECRET
npx prisma generate
npm run db:migrate          # creates the 6 tables
npm run db:seed             # creates a default admin (admin@secureshield.test / Admin@123)
npm run dev
```

Runs on `http://localhost:5000`.

## Structure

```
prisma/schema.prisma   -> Users, Customers, Policies, Claims, PremiumPayments, Documents
prisma/seed.js         -> creates a default Admin login
src/server.js          -> Express app, mounts all routes
src/middleware/auth.js       -> JWT verify + role-based authorize()
src/middleware/validate.js   -> Zod validation wrapper
src/controllers/authController.js -> Admin/Agent register+login, separate Customer login
src/routes/            -> one file per module
uploads/                -> Multer file storage (gitignored, .gitkeep only)
```

## Two logins, by design
Per the spec, Customers are a separate table from Users (Admin/Agent):
- `POST /api/auth/register` + `POST /api/auth/login` → Admin/Agent
- `POST /api/auth/customer-login` → Customer (account created by an Agent/Admin via `POST /api/customers`)

## API reference

| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | public (Admin/Agent) |
| POST | /api/auth/login | public |
| POST | /api/auth/customer-login | public |
| POST | /api/customers | Admin/Agent |
| GET | /api/customers?search=&page=&limit= | Admin/Agent |
| GET | /api/customers/:id | any authenticated |
| PUT | /api/customers/:id | Admin/Agent |
| POST | /api/policies | Admin/Agent |
| GET | /api/policies?status=&search=&page=&limit= | any (Customers see only their own) |
| GET | /api/policies/expiring-soon | Admin/Agent |
| PATCH | /api/policies/:id/renew | Admin/Agent |
| PATCH | /api/policies/:id/cancel | Admin/Agent |
| POST | /api/claims (multipart, optional `document` file) | any authenticated |
| GET | /api/claims?status=&page=&limit= | any (Customers see only their own) |
| PATCH | /api/claims/:id/decision | Admin/Agent |
| POST | /api/premiums | any authenticated |
| GET | /api/premiums/policy/:policyId | any authenticated |
| GET | /api/premiums/overdue | Admin/Agent |
| POST | /api/documents/upload (multipart) | any authenticated |
| GET | /api/documents/customer/:customerId | self, or Admin/Agent |
| GET | /api/documents/:id/download | any authenticated |
| GET | /api/reports/summary | Admin |
| GET | /api/reports/export/pdf | Admin (downloads a PDFKit report) |

## Next (per the two-week schedule)
- Day 11: tighten Zod schemas further (currently core create routes are validated)
- Day 12: add a test suite / run through Postman collection
- Day 14: deploy to Render/Railway, set env vars there
