import React, { createContext, useContext, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Error parsing stored user from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  function persist(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  // Admin/Agent login
  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    return persist(data);
  }

  // Customer login (separate table + endpoint, per spec)
  async function customerLogin(email, password) {
    const { data } = await api.post("/auth/customer-login", { email, password });
    return persist(data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, customerLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
