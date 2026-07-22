import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, UserCheck, Users, ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [mode, setMode] = useState("staff"); // "staff" | "customer"
  const [email, setEmail] = useState("suruthi@secureshield.test");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, customerLogin } = useAuth();
  const navigate = useNavigate();

  async function performLogin(targetMode, targetEmail, targetPassword) {
    setError("");
    setLoading(true);
    try {
      let loggedUser;
      if (targetMode === "staff") {
        loggedUser = await login(targetEmail, targetPassword);
      } else {
        loggedUser = await customerLogin(targetEmail, targetPassword);
      }
      if (loggedUser?.role === "CUSTOMER") {
        navigate("/my-policies");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login attempt failed:", err);
      const serverMessage = err.response?.data?.message || err.response?.data?.details || err.message;
      setError(serverMessage ? `Error: ${serverMessage}` : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e?.preventDefault();
    const cleanEmail = email || (mode === "staff" ? "suruthi@secureshield.test" : "samreena@example.com");
    const cleanPass = password || (mode === "staff" ? "Admin@123" : "Customer@123");
    performLogin(mode, cleanEmail, cleanPass);
  }

  function selectDemo(roleType) {
    setError("");
    if (roleType === "ADMIN") {
      setMode("staff");
      setEmail("suruthi@secureshield.test");
      setPassword("Admin@123");
      performLogin("staff", "suruthi@secureshield.test", "Admin@123");
    } else if (roleType === "AGENT") {
      setMode("staff");
      setEmail("gokul@secureshield.test");
      setPassword("Agent@123");
      performLogin("staff", "gokul@secureshield.test", "Agent@123");
    } else if (roleType === "CUSTOMER") {
      setMode("customer");
      setEmail("samreena@example.com");
      setPassword("Customer@123");
      performLogin("customer", "samreena@example.com", "Customer@123");
    }
  }

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-lg mb-2">
            <ShieldCheck size={32} className="stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome to SecureShield</h1>
          <p className="text-xs text-slate-500">Enterprise Insurance & Claim Management Platform</p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} /> Quick Demo Accounts (Instant Login)
            </span>
            <span className="text-[10px] text-slate-400">Click to Sign In</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => selectDemo("ADMIN")}
              className="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all text-center"
            >
              👑 Suruthi (Admin)
            </button>
            <button
              type="button"
              onClick={() => selectDemo("AGENT")}
              className="px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all text-center"
            >
              💼 Gokul (Agent)
            </button>
            <button
              type="button"
              onClick={() => selectDemo("CUSTOMER")}
              className="px-2.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all text-center"
            >
              👤 Samreena (Customer)
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-md border border-slate-200">
          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("staff");
                setEmail("suruthi@secureshield.test");
                setPassword("Admin@123");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "staff"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users size={14} /> Staff (Admin/Agent)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("customer");
                setEmail("samreena@example.com");
                setPassword("Customer@123");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "customer"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck size={14} /> Policy Customer
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === "staff" ? "suruthi@secureshield.test" : "samreena@example.com"}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
