import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  FileSpreadsheet,
  CreditCard,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Share2,
  Calendar,
  Sparkles,
  Search,
  Bell,
  Megaphone,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-brand-400" /> Welcome back, <span className="bg-gradient-to-r from-brand-400 to-sky-300 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enterprise Advisor Dashboard • Active Session ({user?.role})
          </p>
        </div>
        <Link
          to="/profile"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all self-start sm:self-auto"
        >
          <Share2 size={14} className="text-brand-400" /> Edit Advisor Profile & Branding
        </Link>
      </div>

      {/* Quick Actions Bar (Matching Screenshots 1 & 3) */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-brand-400" /> Quick Actions
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <QuickActionButton to="/customers" label="Add New Client" icon={Users} color="from-sky-500 to-blue-600" />
          <QuickActionButton to="/policies" label="Issue Policy" icon={FileText} color="from-indigo-500 to-purple-600" />
          <QuickActionButton to="/premiums" label="Record Payment" icon={CreditCard} color="from-emerald-500 to-teal-600" />
          <QuickActionButton to="/claims" label="Verify Claims" icon={FileSpreadsheet} color="from-amber-500 to-orange-600" />
          <QuickActionButton to="/profile" label="Share Profile" icon={Share2} color="from-pink-500 to-rose-600" />
          <QuickActionButton to="/reports" label="PDF Reports" icon={BarChart3} color="from-purple-600 to-brand-600" />
        </div>
      </div>

      {/* Main Grid: Left Goal & Breakdown + Right Announcements & Birthdays (Matching Screenshots 1 & 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Track Goal & Breakdown Bar */}
        <div className="lg:col-span-8 space-y-6">
          {/* Goal Growth Widget (Matching Screenshot 1 & 3) */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-400" /> Track your Policy Volume Growth
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  <span className="font-extrabold text-white text-sm">₹1.11Cr</span> of your ₹1.25Cr goal achieved!
                </p>
              </div>
              <Link to="/reports" className="text-xs font-bold text-brand-400 hover:underline">
                View Progress ›
              </Link>
            </div>

            {/* Goal Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 w-[88.8%] shadow-lg shadow-emerald-500/20" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹1Cr</span>
                <span className="text-emerald-400 font-bold">Just ₹13.6L more to reach ₹1.25Cr!</span>
                <span>₹1.25Cr</span>
              </div>
            </div>
          </div>

          {/* Policy Category Breakdown Bar (Matching Screenshot 1 & 3) */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Policy Portfolio Breakdown</h3>
              <Link to="/policies" className="text-xs font-bold text-brand-400 hover:underline">
                View More ›
              </Link>
            </div>

            <div className="space-y-3">
              <p className="text-xl font-extrabold text-white">₹1.11Cr Total Portfolio</p>

              {/* Multi-color Breakdown Bar */}
              <div className="w-full h-3.5 rounded-full bg-slate-900 flex overflow-hidden border border-slate-800">
                <div className="bg-sky-500 h-full w-[69.4%]" title="Health Insurance (69.4%)" />
                <div className="bg-emerald-500 h-full w-[20.1%]" title="Auto Insurance (20.1%)" />
                <div className="bg-purple-500 h-full w-[8.5%]" title="Life Insurance (8.5%)" />
                <div className="bg-amber-500 h-full w-[2.0%]" title="Home Insurance (2.0%)" />
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Health (69.4%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Auto (20.1%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Life (8.5%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Home (2.0%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Announcements + Upcoming Birthdays (Matching Screenshots 1 & 3) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Announcements Banner Card (Matching Screenshot 1 & 3) */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Megaphone size={16} className="text-brand-400" /> Announcements & Guides
              </h3>
            </div>

            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-brand-950/80 to-slate-900 p-4 border border-brand-500/20 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Episode 18 • Monthly Guide
              </span>
              <h4 className="text-xs font-bold text-white leading-snug">
                How Health & Auto Policy Renewals Drive Multi-Bagger Wealth
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Explore recommended policy schemes of the quarter curated by SecureShield expert research team.
              </p>
            </div>
          </div>

          {/* Upcoming Birthdays / Expiries Mini Widget (Matching Screenshot 1 & 3) */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Calendar size={16} className="text-amber-400" /> Upcoming Client Birthdays
              </h3>
              <span className="text-[10px] text-amber-400 font-bold uppercase">JULY</span>
            </div>

            <div className="space-y-2 text-xs">
              <BirthdayRow name="REKHA SANJAY KUMAR" date="22 July" id="1489497" />
              <BirthdayRow name="VINOD JUGRAJ JAIN" date="23 July" id="1456760" />
              <BirthdayRow name="SHUBHAM SHANTILAL KOTHARI" date="26 July" id="1239560" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ to, label, icon: Icon, color }) {
  return (
    <Link
      to={to}
      className="glass-card rounded-xl p-3 text-center flex flex-col items-center justify-center gap-2 group hover:border-brand-500/50 transition-all"
    >
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
        <Icon size={18} />
      </div>
      <span className="text-[11px] font-bold text-slate-300 group-hover:text-white leading-tight">{label}</span>
    </Link>
  );
}

function BirthdayRow({ name, date, id }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
      <div>
        <p className="font-bold text-slate-200 text-xs">{name}</p>
        <p className="text-[10px] text-slate-400 font-mono">ID: {id}</p>
      </div>
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
        {date}
      </span>
    </div>
  );
}
