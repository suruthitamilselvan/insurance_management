import React, { useEffect, useState } from "react";
import { FilePlus2, Filter, RefreshCw, XCircle, ShieldCheck, AlertCircle, Calendar, DollarSign, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client";

export default function Policies() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [expiringSoonFilter, setExpiringSoonFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    customerId: "",
    policyType: "Health Insurance",
    policyNumber: "",
    premiumAmount: "",
    startDate: "",
    endDate: "",
  });

  const isStaff = user?.role === "ADMIN" || user?.role === "AGENT";

  async function load() {
    setLoading(true);
    try {
      if (expiringSoonFilter) {
        const { data } = await api.get("/policies/expiring-soon");
        setPolicies(data || []);
      } else {
        const { data } = await api.get("/policies", { params: { status: statusFilter || undefined } });
        setPolicies(data.policies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomers() {
    if (!isStaff) return;
    try {
      const { data } = await api.get("/customers", { params: { limit: 100 } });
      setCustomersList(data.customers || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter, expiringSoonFilter]);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await api.post("/policies", form);
      setForm({ customerId: "", policyType: "Health Insurance", policyNumber: "", premiumAmount: "", startDate: "", endDate: "" });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create policy");
    }
  }

  async function renew(id) {
    if (!window.confirm("Renew this policy for another 1 year?")) return;
    try {
      await api.patch(`/policies/${id}/renew`);
      load();
    } catch (err) {
      alert("Renewal failed");
    }
  }

  async function cancel(id) {
    if (!window.confirm("Are you sure you want to cancel this policy?")) return;
    try {
      await api.patch(`/policies/${id}/cancel`);
      load();
    } catch (err) {
      alert("Cancellation failed");
    }
  }

  const statusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">Active</span>;
      case "EXPIRED":
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">Expired</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-brand-400" /> Insurance Policy Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Issue policies, track expiration dates, process renewals, and handle cancellations.
          </p>
        </div>
        {isStaff && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all glow-btn"
          >
            <FilePlus2 size={16} /> {showForm ? "Cancel Creation" : "Issue New Policy"}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400 ml-2" />
          <button
            onClick={() => { setExpiringSoonFilter(false); setStatusFilter(""); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!expiringSoonFilter && statusFilter === "" ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            All Policies
          </button>
          <button
            onClick={() => { setExpiringSoonFilter(false); setStatusFilter("ACTIVE"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!expiringSoonFilter && statusFilter === "ACTIVE" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Active
          </button>
          <button
            onClick={() => { setExpiringSoonFilter(false); setStatusFilter("EXPIRED"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!expiringSoonFilter && statusFilter === "EXPIRED" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Expired
          </button>

          {isStaff && (
            <button
              onClick={() => setExpiringSoonFilter((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${expiringSoonFilter ? "bg-orange-500 text-white" : "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30"}`}
            >
              <AlertCircle size={14} /> Expiring Soon (30 Days)
            </button>
          )}
        </div>
      </div>

      {/* Creation Form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 border border-brand-500/30 space-y-4 max-w-3xl animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FilePlus2 size={18} className="text-brand-400" /> Issue Insurance Policy
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Customer</label>
              <select
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              >
                <option value="">-- Choose Customer --</option>
                {customersList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Policy Type</label>
              <select
                value={form.policyType}
                onChange={(e) => setForm({ ...form, policyType: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              >
                <option value="Health Insurance">Health Insurance</option>
                <option value="Auto Insurance">Auto Insurance</option>
                <option value="Home Insurance">Home Insurance</option>
                <option value="Life Insurance">Life Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Policy Number</label>
              <input
                placeholder="e.g. POL-HEALTH-9901"
                value={form.policyNumber}
                onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Premium Amount ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="250.00"
                value={form.premiumAmount}
                onChange={(e) => setForm({ ...form, premiumAmount: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
              >
                Save & Issue Policy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Policies Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Policy #</th>
                <th className="p-4">Policyholder</th>
                <th className="p-4">Type</th>
                <th className="p-4">Premium</th>
                <th className="p-4">Coverage Period</th>
                <th className="p-4">Status</th>
                {isStaff && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={isStaff ? 7 : 6} className="p-8 text-center text-slate-400">
                    Loading policy records...
                  </td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={isStaff ? 7 : 6} className="p-8 text-center text-slate-400">
                    No policy records found.
                  </td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-300">{p.policyNumber}</td>
                    <td className="p-4 font-semibold text-white">
                      {p.customer?.name || `Customer #${p.customerId}`}
                    </td>
                    <td className="p-4 text-xs text-slate-300">{p.policyType}</td>
                    <td className="p-4 font-semibold text-emerald-400">${p.premiumAmount}</td>
                    <td className="p-4 text-xs text-slate-400 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">{statusBadge(p.status)}</td>
                    {isStaff && (
                      <td className="p-4 text-right space-x-2">
                        {p.status === "ACTIVE" && (
                          <>
                            <button
                              onClick={() => renew(p.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-all"
                              title="Renew Policy (+1 Year)"
                            >
                              <RefreshCw size={12} className="inline mr-1" /> Renew
                            </button>
                            <button
                              onClick={() => cancel(p.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
                              title="Cancel Policy"
                            >
                              <XCircle size={12} className="inline mr-1" /> Cancel
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
