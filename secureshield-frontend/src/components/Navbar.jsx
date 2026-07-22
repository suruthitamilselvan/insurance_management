import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, Users, FileText, FileSpreadsheet, CreditCard, BarChart3, UserCheck, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
      isActive(path)
        ? "bg-brand-500/20 text-brand-400 border border-brand-500/30 shadow-sm"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  const roleColor = {
    ADMIN: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    AGENT: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    CUSTOMER: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              SecureShield
            </span>
            <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-800 text-brand-400 border border-slate-700">
              Enterprise
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
                {(user.role === "ADMIN" || user.role === "AGENT") && (
                  <>
                    <Link to="/customers" className={navLinkClass("/customers")}>
                      <Users size={15} /> Customers
                    </Link>
                    <Link to="/policies" className={navLinkClass("/policies")}>
                      <FileText size={15} /> Policies
                    </Link>
                    <Link to="/claims" className={navLinkClass("/claims")}>
                      <FileSpreadsheet size={15} /> Claims
                    </Link>
                    <Link to="/premiums" className={navLinkClass("/premiums")}>
                      <CreditCard size={15} /> Premiums
                    </Link>
                  </>
                )}
                {user.role === "ADMIN" && (
                  <Link to="/reports" className={navLinkClass("/reports")}>
                    <BarChart3 size={15} /> Reports
                  </Link>
                )}
                {user.role === "CUSTOMER" && (
                  <>
                    <Link to="/my-policies" className={navLinkClass("/my-policies")}>
                      <Shield size={15} /> My Policies
                    </Link>
                    <Link to="/my-claims" className={navLinkClass("/my-claims")}>
                      <FileSpreadsheet size={15} /> My Claims
                    </Link>
                  </>
                )}
              </div>

              {/* User Badge */}
              <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                  <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${roleColor[user.role] || "bg-slate-800 text-slate-300"}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
                title="Log out of SecureShield"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all glow-btn"
            >
              <UserCheck size={16} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
