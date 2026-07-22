import React from "react";
import { Link } from "react-router-dom";
import { Users, FileText, FileSpreadsheet, CreditCard, BarChart3, Shield, ArrowRight, ShieldCheck, CheckCircle2, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-brand-950/40">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
            <ShieldCheck size={14} /> Active Session • {user?.role} Access
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-brand-400 to-sky-300 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Manage policy lifecycles, process claim settlements, track premium due dates, and view real-time operations performance from your centralized platform.
          </p>
        </div>

        <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Role-Specific Quick Nav Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity size={18} className="text-brand-400" /> Platform Workspaces
        </h2>

        {(user?.role === "ADMIN" || user?.role === "AGENT") && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              to="/customers"
              title="Customer Directory"
              description="Register new customer profiles, search accounts, and view history logs."
              icon={Users}
              badge="Module 1"
              color="from-sky-500/20 to-blue-600/10 text-sky-400"
            />
            <ActionCard
              to="/policies"
              title="Policy Management"
              description="Issue policies, execute renewals, cancel policies, and inspect active records."
              icon={FileText}
              badge="Module 2"
              color="from-indigo-500/20 to-purple-600/10 text-indigo-400"
            />
            <ActionCard
              to="/claims"
              title="Claims Operations"
              description="Review submitted claims, verify attached supporting files, approve/reject."
              icon={FileSpreadsheet}
              badge="Module 3"
              color="from-amber-500/20 to-orange-600/10 text-amber-400"
            />
            <ActionCard
              to="/premiums"
              title="Premium Tracking"
              description="Record customer premium payments, track overdue alerts, and view payment logs."
              icon={CreditCard}
              badge="Module 4"
              color="from-emerald-500/20 to-teal-600/10 text-emerald-400"
            />
          </div>
        )}

        {user?.role === "ADMIN" && (
          <div className="mt-4">
            <Link
              to="/reports"
              className="glass-card rounded-2xl p-6 border border-purple-500/30 flex items-center justify-between hover:border-purple-500/60 group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 border border-purple-500/30">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Executive Analytics Dashboard</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Admin Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Monitor overall business metrics, premium collections, active/expired stats, and export PDF reports.
                  </p>
                </div>
              </div>
              <ArrowRight size={20} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {user?.role === "CUSTOMER" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              to="/my-policies"
              title="My Insurance Policies"
              description="View your active policies, coverage details, validity dates, and download documents."
              icon={Shield}
              badge="Customer Hub"
              color="from-sky-500/20 to-blue-600/10 text-sky-400"
            />
            <ActionCard
              to="/my-claims"
              title="My Claim Requests"
              description="File insurance claim requests, attach supporting proof, and track real-time settlement status."
              icon={FileSpreadsheet}
              badge="Customer Hub"
              color="from-emerald-500/20 to-teal-600/10 text-emerald-400"
            />
          </div>
        )}
      </div>

      {/* Feature Specs Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          System Operational Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <StatusItem label="REST API Server" status="Active on Port 5000" icon={CheckCircle2} />
          <StatusItem label="Database Engine" status="Prisma SQLite Synced" icon={CheckCircle2} />
          <StatusItem label="PDF Engine" status="PDFKit Ready" icon={CheckCircle2} />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ to, title, description, icon: Icon, badge, color }) {
  return (
    <Link to={to} className="glass-card rounded-2xl p-5 flex flex-col justify-between group">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center border border-white/10`}>
            <Icon size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{badge}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">{title}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-end text-xs font-semibold text-brand-400 gap-1 group-hover:translate-x-0.5 transition-transform">
        Open Workspace <ArrowRight size={14} />
      </div>
    </Link>
  );
}

function StatusItem({ label, status, icon: Icon }) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
      <Icon size={16} className="text-emerald-400 shrink-0" />
      <div>
        <p className="font-semibold text-slate-200">{label}</p>
        <p className="text-[11px] text-emerald-400/90 font-mono">{status}</p>
      </div>
    </div>
  );
}
