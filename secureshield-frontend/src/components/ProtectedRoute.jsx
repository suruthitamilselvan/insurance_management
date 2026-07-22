import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // If user object is missing or malformed (no role), clear stale cache and redirect to login
  if (!user || !user.role) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (user.role === "CUSTOMER" && (!allowedRoles || !allowedRoles.includes("CUSTOMER"))) {
    return <Navigate to="/my-policies" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "CUSTOMER" ? "/my-policies" : "/"} replace />;
  }

  return children;
}
