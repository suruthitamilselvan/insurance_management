import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, UserCheck, Users, ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [mode, setMode] = useState("staff"); // "staff" | "customer"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, customerLogin } = useAuth();
  const navigate = useNavigate();

  async function performLogin(targetMode, targetEmail, targetPassword) {
    setError("");
    setLoading(true);
    try {
      if (targetMode === "staff") {
        await login(targetEmail, targetPassword);
      } else {
        await customerLogin(targetEmail, targetPassword);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e?.preventDefault();
    if (!email || !password) return;
    performLogin(mode, email, password);
  }

  function fillAndLogin(roleType) {
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 text-white shadow-xl shadow-brand-500/20 mb-2">
            <ShieldCheck size={32} className="stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome to SecureShield</h1>
          <p className="text-sm text-slate-400">Enterprise Insurance & Claim Management Platform</p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} /> Quick Demo Accounts (Instant Login)
            </span>
            <span className="text-[10px] text-slate-400">Click to Sign In</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillAndLogin("ADMIN")}
              className="px-2.5 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all text-center"
            >
              👑 Suruthi (Admin)
            </button>
            <button
              type="button"
              onClick={() => fillAndLogin("AGENT")}
              className="px-2.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all text-center"
            >
              💼 Gokul (Agent)
            </button>
            <button
              type="button"
              onClick={() => fillAndLogin("CUSTOMER")}
              className="px-2.5 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold transition-all text-center"
            >
              👤 Samreena (Customer)
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-800">
          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setMode("staff")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "staff"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users size={14} /> Staff (Admin/Agent)
            </button>
            <button
              type="button"
              onClick={() => setMode("customer")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "customer"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck size={14} /> Policy Customer
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === "staff" ? "suruthi@secureshield.test" : "samreena@example.com"}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 glow-btn disabled:opacity-50"
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
