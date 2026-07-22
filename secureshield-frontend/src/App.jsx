import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Customers from "./pages/Customers.jsx";
import Policies from "./pages/Policies.jsx";
import Claims from "./pages/Claims.jsx";
import Premiums from "./pages/Premiums.jsx";
import Reports from "./pages/Reports.jsx";
import MyPolicies from "./pages/MyPolicies.jsx";
import MyClaims from "./pages/MyClaims.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        <Route path="/customers" element={<ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}><Customers /></ProtectedRoute>} />
        <Route path="/policies" element={<ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}><Policies /></ProtectedRoute>} />
        <Route path="/claims" element={<ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}><Claims /></ProtectedRoute>} />
        <Route path="/premiums" element={<ProtectedRoute allowedRoles={["ADMIN", "AGENT"]}><Premiums /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Reports /></ProtectedRoute>} />

        <Route path="/my-policies" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><MyPolicies /></ProtectedRoute>} />
        <Route path="/my-claims" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><MyClaims /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
