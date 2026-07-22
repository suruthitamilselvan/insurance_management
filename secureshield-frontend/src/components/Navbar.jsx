import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  Users,
  FileText,
  FileSpreadsheet,
  CreditCard,
  BarChart3,
  UserCheck,
  Search,
  Bell,
  MessageSquare,
  Zap,
  User,
  ChevronDown,
} from "lucide-react";
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
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
      isActive(path)
        ? "bg-white/20 text-white shadow-inner font-bold"
        : "text-blue-100 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#0f52ba] text-white shadow-md border-b border-blue-700">
      <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Brand Logo + Primary Nav Links (Matching Instructor Screenshot) */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-white text-[#0f52ba] flex items-center justify-center font-black text-sm shadow">
              A
            </div>
            <span>AssetPlus <span className="text-blue-200 text-xs font-medium">/ SecureShield</span></span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className={navLinkClass("/")}>Home</Link>
              {(user.role === "ADMIN" || user.role === "AGENT") && (
                <>
                  <Link to="/customers" className={navLinkClass("/customers")}>Clients</Link>
                  <Link to="/policies" className={navLinkClass("/policies")}>Policies</Link>
                  <Link to="/claims" className={navLinkClass("/claims")}>Claims</Link>
                  <Link to="/premiums" className={navLinkClass("/premiums")}>Premiums</Link>
                </>
              )}
              {user.role === "ADMIN" && (
                <Link to="/reports" className={navLinkClass("/reports")}>Reports</Link>
              )}
              {user.role === "CUSTOMER" && (
                <>
                  <Link to="/my-policies" className={navLinkClass("/my-policies")}>My Policies</Link>
                  <Link to="/my-claims" className={navLinkClass("/my-claims")}>My Claims</Link>
                </>
              )}
            </nav>
          )}
        </div>

        {/* Center Search Input (Matching Instructor Screenshot) */}
        {user && (
          <div className="hidden lg:flex flex-1 max-w-md items-center relative">
            <Search size={14} className="absolute left-3 text-blue-200" />
            <input
              placeholder="Search Clients, Products & Resources (Ctrl+K)"
              className="w-full bg-blue-700/60 border border-blue-500/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-blue-200 focus:outline-none focus:bg-blue-800"
            />
          </div>
        )}

        {/* Right Status & Notifications (Matching Instructor Screenshot) */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Badges */}
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-blue-700/80 text-blue-100 text-[11px] font-semibold">
                  <MessageSquare size={12} /> Messages
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-blue-700/80 text-blue-100 text-[11px] font-semibold">
                  <Bell size={12} /> Alerts <span className="bg-rose-500 text-white px-1.5 py-0.2 text-[9px] font-bold rounded-full">44</span>
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-blue-700/80 text-blue-100 text-[11px] font-semibold">
                  <Zap size={12} /> Triggers <span className="bg-rose-500 text-white px-1.5 py-0.2 text-[9px] font-bold rounded-full">440</span>
                </span>
              </div>

              {/* User Profile Button */}
              <div className="flex items-center gap-2 pl-2 border-l border-blue-600">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-white/10 p-1.5 rounded-lg transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-white text-[#0f52ba] flex items-center justify-center font-bold text-xs">
                    {user.name?.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-xs font-bold leading-none">{user.name}</p>
                    <p className="text-[10px] text-blue-200 leading-none mt-0.5">{user.role}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-blue-100 hover:text-white"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg bg-white text-[#0f52ba] font-bold text-xs hover:bg-blue-50 transition-colors shadow"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
