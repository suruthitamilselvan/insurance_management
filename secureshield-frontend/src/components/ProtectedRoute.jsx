import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "CUSTOMER" && (!allowedRoles || !allowedRoles.includes("CUSTOMER"))) {
    return <Navigate to="/my-policies" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "CUSTOMER" ? "/my-policies" : "/"} replace />;
  }

  return children;
}
