# SecureShield — Frontend (Insurance Management Platform)

React 19 + Vite + Tailwind + React Router + Context API + Chart.js + lucide-react.

## Setup

```bash
npm install
cp .env.example .env      # point VITE_API_URL at your backend
npm run dev
```

Runs on `http://localhost:5173`.

## Structure

```
src/context/AuthContext.jsx  -> login (Admin/Agent) + customerLogin, stores JWT + user
src/api/client.js            -> axios instance, auto-attaches Bearer token
src/components/              -> Navbar (role-aware links), ProtectedRoute (role guard)
src/pages/
  Login.jsx        -> toggle between Admin/Agent login and Customer login
  Home.jsx
  Customers.jsx    -> register + search + list (Admin/Agent)
  Policies.jsx     -> create, filter by status, renew, cancel (Admin/Agent); read-only view if Customer
  Claims.jsx       -> submit with optional file upload, approve/reject (Admin/Agent)
  Premiums.jsx     -> record payment, history, overdue alerts (Admin/Agent)
  Reports.jsx      -> Admin-only dashboard, Chart.js bar chart + PDF export button
  MyPolicies.jsx   -> Customer-only, scoped to their own policies
  MyClaims.jsx     -> Customer-only, scoped to their own claims
```

## Login flow
Two logins share one screen (toggle at the top of Login.jsx):
- **Admin / Agent** → `POST /api/auth/login`
- **Customer** → `POST /api/auth/customer-login` (their account must first be registered by an Agent/Admin via the Customers page)
