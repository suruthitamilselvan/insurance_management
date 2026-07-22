import React, { useEffect, useState } from "react";
import { CreditCard, AlertTriangle, CheckCircle2, Clock, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client";

export default function Premiums() {
  const { user } = useAuth();
  const [policyId, setPolicyId] = useState("");
  const [policiesList, setPoliciesList] = useState([]);
  const [payments, setPayments] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ policyId: "", amount: "" });
  const isStaff = user?.role === "ADMIN" || user?.role === "AGENT";

  async function loadPolicies() {
    try {
      const { data } = await api.get("/policies");
      setPoliciesList(data.policies || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadOverdue() {
    if (!isStaff) return;
    try {
      const { data } = await api.get("/premiums/overdue");
      setOverdue(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadPolicies();
    loadOverdue();
  }, []);

  async function loadPayments() {
    if (!policyId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/premiums/policy/${policyId}`);
      setPayments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecord(e) {
    e.preventDefault();
    try {
      await api.post("/premiums", {
        policyId: Number(form.policyId),
        amount: Number(form.amount),
        paymentStatus: "PAID",
      });
      setForm({ policyId: "", amount: "" });
      alert("Premium payment recorded successfully!");
      loadOverdue();
      if (policyId === form.policyId) {
        loadPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to record payment");
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="text-brand-400" /> Premium Payments & Overdue Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Record customer premium payments, inspect payment history logs, and manage overdue alerts.
        </p>
      </div>

      {/* Grid: Record Payment & Overdue Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Record Payment Form */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard size={18} className="text-emerald-400" /> Record Premium Payment
          </h3>
          <form onSubmit={handleRecord} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Policy</label>
              <select
                value={form.policyId}
                onChange={(e) => {
                  const selectedPol = policiesList.find((p) => String(p.id) === e.target.value);
                  setForm({
                    ...form,
                    policyId: e.target.value,
                    amount: selectedPol ? selectedPol.premiumAmount : "",
                  });
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                required
              >
                <option value="">-- Choose Policy --</option>
                {policiesList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.policyNumber} — {p.policyType} (${p.premiumAmount})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Amount ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="250.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all glow-btn"
            >
              Record Payment Receipt
            </button>
          </form>
        </div>

        {/* Overdue Alerts Section */}
        {isStaff && (
          <div className="glass-panel rounded-2xl p-6 border border-rose-500/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle size={18} className="text-rose-400" /> Overdue Premium Alerts
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {overdue.length} Overdue
                </span>
              </div>
              <div className="overflow-x-auto max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Policy Number</th>
                      <th className="p-3">Amount Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {overdue.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-slate-400">
                          No overdue premium payments found! 🎉
                        </td>
                      </tr>
                    ) : (
                      overdue.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-semibold text-white">
                            {p.policy?.customer?.name || `Customer #${p.policy?.customerId}`}
                          </td>
                          <td className="p-3 font-mono text-brand-300">{p.policy?.policyNumber}</td>
                          <td className="p-3 font-bold text-rose-400">${p.amount}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment History Lookup */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Search size={18} className="text-brand-400" /> Policy Payment History Lookup
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <select
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
          >
            <option value="">-- Select Policy to Inspect History --</option>
            {policiesList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.policyNumber} ({p.customer?.name})
              </option>
            ))}
          </select>
          <button
            onClick={loadPayments}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20"
          >
            Load Payment History
          </button>
        </div>

        {policyId && (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-slate-400">Loading history...</td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-slate-400">No payment history recorded for this policy yet.</td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3">{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td className="p-3 font-semibold text-emerald-400">${p.amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${p.paymentStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
