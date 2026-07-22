import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  FileSpreadsheet,
  CreditCard,
  BarChart3,
  TrendingUp,
  Share2,
  Calendar,
  Sparkles,
  Megaphone,
  PlayCircle,
  ExternalLink,
  Award,
  Video,
  ChevronRight,
  BookOpen,
  Filter,
  PlusCircle,
  Briefcase,
  Layers,
  HeartHandshake,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* 3-Column Enterprise Dashboard Layout (Matching Screenshots 1 & 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Sidebar Navigation Sub-links (Matching Screenshot 1 & 3) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm space-y-1">
            <SidebarLink to="/customers" label="Action Centre" active icon={ZapIcon} />
            <SidebarLink to="/customers" label="All Clients" icon={Users} />
            <SidebarLink to="/customers" label="Prospects" icon={Briefcase} />
            <SidebarLink to="/policies" label="Opportunities" icon={Layers} />
            <SidebarLink to="/premiums" label="Order History" icon={FileSpreadsheet} />
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs space-y-2">
            <span className="font-bold text-blue-900 flex items-center gap-1">
              <HeartHandshake size={14} className="text-blue-600" /> Need Help?
            </span>
            <p className="text-[11px] text-blue-700 leading-snug">
              Help us improve AssetPlus. Share your feedback with support.
            </p>
          </div>
        </div>

        {/* MIDDLE COLUMN (7 cols): Quick Actions, Goal Tracker & Breakdown */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Quick Actions Bar (Matching Screenshots 1 & 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quick Actions
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              <QuickActionButton to="/customers" label="Add New Client" icon={Users} color="bg-blue-50 text-blue-600" />
              <QuickActionButton to="/policies" label="New Transaction" icon={PlusCircle} color="bg-emerald-50 text-emerald-600" />
              <QuickActionButton to="/policies" label="Fund Finder" icon={Sparkles} color="bg-teal-50 text-teal-600" />
              <QuickActionButton to="/claims" label="Portfolio Scanner" icon={FileSpreadsheet} color="bg-purple-50 text-purple-600" />
              <QuickActionButton to="/profile" label="Share Profile" icon={Share2} color="bg-amber-50 text-amber-600" />
              <QuickActionButton to="/policies" label="Health Insurance" icon={FileText} color="bg-sky-50 text-sky-600" />
            </div>
          </div>

          {/* Goal Growth Progress Card (Matching Screenshots 1 & 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Track your AUM / Policy Growth
                </h3>
                <p className="text-lg font-extrabold text-slate-900 mt-1">
                  ₹1.11Cr <span className="text-xs font-normal text-slate-500">of your goal achieved!</span>
                </p>
              </div>
              <Link to="/reports" className="text-xs font-bold text-blue-600 hover:underline">
                View Progress ›
              </Link>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div className="h-full rounded-full bg-emerald-500 w-[88.8%]" />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>₹1Cr</span>
                <span className="text-emerald-600 font-bold">Just ₹13.6L more to reach ₹1.25Cr</span>
                <span>₹1.25Cr</span>
              </div>
            </div>
          </div>

          {/* Policy Breakdown Card (Matching Screenshots 1 & 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AUM Breakdown</h3>
              <Link to="/policies" className="text-xs font-bold text-blue-600 hover:underline">
                View More ›
              </Link>
            </div>

            <div className="space-y-3">
              <p className="text-2xl font-extrabold text-slate-900">₹1.11Cr</p>

              {/* Multi-color Breakdown Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden border border-slate-200">
                <div className="bg-blue-600 h-full w-[69.4%]" />
                <div className="bg-emerald-500 h-full w-[20.1%]" />
                <div className="bg-purple-600 h-full w-[8.5%]" />
                <div className="bg-amber-500 h-full w-[2.0%]" />
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Equity (69.4%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Debt (20.1%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Hybrid (8.5%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Other (2.0%)</span>
              </div>
            </div>
          </div>

          {/* Today Updates List Card (Matching Screenshot 1 & 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700 uppercase">Today, 19 Jul 2026</span>
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">1 Items</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">SHUBHAM SHANTILAL KOTHARI (1239560)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Pause SIP — Resuming on 03 Aug, 2026</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">19-Jul-26</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Announcements & Promotional Ad Banners (Matching Screenshot 1 & 3) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Announcements Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Announcements</h3>
          </div>

          {/* PROMOTIONAL AD BANNER 1: Episode 18 Video Card (Matching Screenshot 1 & 3) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-4 text-white space-y-2 relative">
              <span className="px-2 py-0.5 rounded bg-blue-500/40 text-[10px] font-extrabold uppercase tracking-wider text-blue-100 border border-blue-400/30">
                EPISODE-18
              </span>
              <h4 className="text-sm font-extrabold leading-tight text-white uppercase">
                CAN MUTUAL FUNDS CREATE MULTIBAGGER WEALTH?
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-blue-200 pt-1 font-semibold">
                <PlayCircle size={16} /> Watch Video Session
              </div>
            </div>
          </div>

          {/* Community Section Header (Matching Screenshot 1 & 3) */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Community</h3>
          </div>

          {/* PROMOTIONAL AD BANNER 2: AssetPlus BD Event Card (Matching Screenshot 1 & 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">AssetPlus BD</span>
              <span className="text-[10px] text-slate-400">Saturday, 19 July 2026, 11:48 AM</span>
            </div>

            <div className="rounded-lg overflow-hidden border border-blue-100 bg-blue-50/50 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[9px] uppercase">
                  ASSETPLUS
                </div>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                Monthly Guide to Markets & Investment Strategy — June Edition
              </h4>
              <button
                onClick={() => alert("Opening Monthly Strategy Guide...")}
                className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                View Full Strategy
              </button>
            </div>
          </div>

          {/* Upcoming Birthdays Card (Matching Screenshot 1 & 3) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Upcoming Birthdays</span>
              <span className="text-[10px] font-bold text-blue-600">JULY</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">REKHA SANJAY KUMAR</p>
                  <p className="text-[10px] text-slate-400">1489497</p>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">22 July</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">VINOD JUGRAJ JAIN</p>
                  <p className="text-[10px] text-slate-400">1456760</p>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">23 July</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function SidebarLink({ to, label, active, icon: Icon }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
        active
          ? "bg-blue-50 text-blue-700 font-bold border border-blue-100"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={14} className={active ? "text-blue-600" : "text-slate-400"} />
      {label}
    </Link>
  );
}

function QuickActionButton({ to, label, icon: Icon, color }) {
  return (
    <Link
      to={to}
      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-1.5"
    >
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
        <Icon size={16} />
      </div>
      <span className="text-[10px] font-bold text-slate-700 leading-tight">{label}</span>
    </Link>
  );
}

function ZapIcon(props) {
  return <Sparkles {...props} />;
}
