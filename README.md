# SecureShield — Insurance Management Platform

A comprehensive enterprise web-based Insurance Management Platform built with Express.js, Prisma ORM, SQLite/PostgreSQL, React 19, Vite, Tailwind CSS, Chart.js, and PDFKit.

---

## 🌟 Project Overview

**SecureShield** simplifies and digitizes end-to-end insurance operations, allowing Administrators, Insurance Agents, and Policyholders (Customers) to manage policies, process claim requests, record premium payments, upload supporting documents, and view real-time business performance analytics.

---

## 📁 Repository Architecture

```
insurance_management/
├── secureshield-backend/     # Express.js REST API, Prisma ORM, SQLite DB, JWT Auth, PDFKit
│   ├── prisma/               # Schema, migrations, seed data (Suruthi, Gokul, Samreena)
│   ├── src/                  # Controllers, middleware, routes, utils
│   ├── uploads/              # Storage directory for customer identity & claim documents
│   ├── .env.example
│   └── package.json
│
└── secureshield-frontend/    # React 19 SPA, Vite, Tailwind CSS v3, Chart.js, Lucide Icons
    ├── src/
    │   ├── api/              # Axios client with JWT bearer interceptors
    │   ├── components/       # Navbar with active route highlighting & role badges
    │   ├── context/          # AuthContext managing staff & customer sessions
    │   └── pages/            # Login, Home, Customers, Policies, Claims, Premiums, Reports
    ├── index.html
    └── package.json
```

---

## 🔐 Demo Credentials

| Role | Name | Email | Password | Access Level |
|---|---|---|---|---|
| **Administrator** | Suruthi | `suruthi@secureshield.test` | `Admin@123` | Full system access, Reports & PDF Export |
| **Insurance Agent** | Gokul | `gokul@secureshield.test` | `Agent@123` | Customers, Policies, Claims verification, Premiums |
| **Customer** | Samreena | `samreena@example.com` | `Customer@123` | Customer Portal ("My Policies", "My Claims") |

---

## 🚀 Quick Setup & Installation

### 1. Backend Setup
```bash
cd secureshield-backend
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
*Backend API runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd secureshield-frontend
npm install
npm run dev
```
*Frontend Web App runs on `http://localhost:5173`*

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, Prisma ORM, SQLite / PostgreSQL, JWT, bcryptjs, Multer, Zod, PDFKit
- **Frontend**: React 19, Vite, Tailwind CSS v3, Chart.js, React-ChartJS-2, Lucide React, Axios
