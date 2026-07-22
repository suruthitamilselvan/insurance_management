import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Download, BarChart3, ShieldCheck, DollarSign, Users, AlertCircle, FileCheck, FileX, Loader2 } from "lucide-react";
import api from "../api/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get("/reports/summary").then(({ data }) => setSummary(data));
  }, []);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const res = await api.get("/reports/export/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `SecureShield-Monthly-Business-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("PDF report export failed");
    } finally {
      setDownloading(false);
    }
  }

  if (!summary) {
    return (
      <div className="max-w-7xl mx-auto p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
          <Loader2 className="animate-spin text-brand-400" size={20} /> Loading Executive Reports Dashboard...
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ["Active Policies", "Expired Policies", "Total Claims", "Approved Claims", "Rejected Claims", "Total Customers"],
    datasets: [
      {
        label: "Business Operations Count",
        data: [
          summary.activePolicies,
          summary.expiredPolicies,
          summary.totalClaims,
          summary.approvedClaims,
          summary.rejectedClaims,
          summary.totalCustomers,
        ],
        backgroundColor: [
          "rgba(14, 165, 233, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(244, 63, 94, 0.8)",
          "rgba(56, 189, 248, 0.8)",
        ],
        borderColor: [
          "#0ea5e9",
          "#f59e0b",
          "#a855f7",
          "#10b981",
          "#f43f5e",
          "#38bdf8",
        ],
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#38bdf8",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8", font: { size: 11 } },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="text-brand-400" /> Executive Reports & Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time business performance analytics, active coverage stats, and official PDF report generation.
          </p>
        </div>

        <button
          onClick={downloadPdf}
          disabled={downloading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all glow-btn disabled:opacity-50"
        >
          {downloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
          Export Executive PDF Report
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          label="Active Policies"
          value={summary.activePolicies}
          icon={ShieldCheck}
          color="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
        />
        <StatCard
          label="Expired Policies"
          value={summary.expiredPolicies}
          icon={AlertCircle}
          color="text-amber-400 bg-amber-500/10 border-amber-500/30"
        />
        <StatCard
          label="Total Customers"
          value={summary.totalCustomers}
          icon={Users}
          color="text-sky-400 bg-sky-500/10 border-sky-500/30"
        />
        <StatCard
          label="Claims Processed"
          value={summary.totalClaims}
          subtext={`Appr: ${summary.approvedClaims} / Rej: ${summary.rejectedClaims}`}
          icon={FileCheck}
          color="text-purple-400 bg-purple-500/10 border-purple-500/30"
        />
        <StatCard
          label="Total Premium Collected"
          value={`$${Number(summary.totalPremiumCollected).toLocaleString()}`}
          icon={DollarSign}
          color="text-teal-400 bg-teal-500/10 border-teal-500/30"
        />
      </div>

      {/* Chart.js Analytics Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-400" /> Operations Overview Chart
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live Sync</span>
        </div>
        <div className="h-80 w-full pt-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext, icon: Icon, color }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-extrabold text-white tracking-tight">{value}</p>
        {subtext && <p className="text-[11px] text-slate-400 mt-1 font-mono">{subtext}</p>}
      </div>
    </div>
  );
}
