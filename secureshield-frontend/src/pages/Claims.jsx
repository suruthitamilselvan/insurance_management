import React, { useEffect, useState } from "react";
import { FileSpreadsheet, PlusCircle, CheckCircle2, XCircle, Clock, Upload, Shield, Filter, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client";

export default function Claims() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [policiesList, setPoliciesList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({ policyId: "", claimAmount: "", reason: "" });
  const [file, setFile] = useState(null);

  const canDecide = user?.role === "ADMIN" || user?.role === "AGENT";

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/claims", { params: { status: statusFilter || undefined } });
      setClaims(data.claims || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadPolicies() {
    try {
      const { data } = await api.get("/policies");
      setPoliciesList(data.policies || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  useEffect(() => {
    loadPolicies();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const body = new FormData();
      body.append("policyId", form.policyId);
      body.append("claimAmount", form.claimAmount);
      body.append("reason", form.reason);
      if (file) body.append("document", file);

      await api.post("/claims", body, { headers: { "Content-Type": "multipart/form-data" } });
      setForm({ policyId: "", claimAmount: "", reason: "" });
      setFile(null);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit claim");
    }
  }

  async function decide(id, decision) {
    try {
      await api.patch(`/claims/${id}/decision`, { decision });
      load();
    } catch (err) {
      alert("Decision failed");
    }
  }

  const claimStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle2 size={12} /> Approved</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><XCircle size={12} /> Rejected</span>;
      case "PENDING":
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock size={12} /> Verification Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="text-brand-400" /> Claims Verification & Settlement
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Submit claims, verify supporting evidence documents, and authorize settlement decisions.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all glow-btn"
        >
          <PlusCircle size={16} /> {showForm ? "Cancel Submission" : "Submit Insurance Claim"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <Filter size={16} className="text-slate-400 ml-2" />
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === "" ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white"}`}
        >
          All Claims
        </button>
        <button
          onClick={() => setStatusFilter("PENDING")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === "PENDING" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setStatusFilter("APPROVED")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === "APPROVED" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Approved
        </button>
        <button
          onClick={() => setStatusFilter("REJECTED")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === "REJECTED" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"}`}
        >
          Rejected
        </button>
      </div>

      {/* Submit Form Card */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 border border-brand-500/30 space-y-4 max-w-3xl animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle size={18} className="text-brand-400" /> Submit Claim Request
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Policy</label>
              <select
                value={form.policyId}
                onChange={(e) => setForm({ ...form, policyId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              >
                <option value="">-- Choose Policy --</option>
                {policiesList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.policyNumber} — {p.policyType} ({p.customer?.name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Claim Amount ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={form.claimAmount}
                onChange={(e) => setForm({ ...form, claimAmount: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Description of Incident</label>
              <textarea
                rows={3}
                placeholder="Describe details of medical expense, accident, or damage..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Attach Supporting Proof / Receipt (Optional)</label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-dashed border-slate-700">
                <Upload size={18} className="text-slate-400" />
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-500/20 file:text-brand-300"
                />
              </div>
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
                File Claim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Claims Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Claim ID</th>
                <th className="p-4">Policy Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Requested Amount</th>
                <th className="p-4">Reason / Description</th>
                <th className="p-4">Status</th>
                {canDecide && <th className="p-4 text-right">Verification Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={canDecide ? 7 : 6} className="p-8 text-center text-slate-400">
                    Loading claims...
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={canDecide ? 7 : 6} className="p-8 text-center text-slate-400">
                    No claim records found.
                  </td>
                </tr>
              ) : (
                claims.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-400">#{c.id}</td>
                    <td className="p-4 font-mono font-bold text-brand-300">{c.policy?.policyNumber}</td>
                    <td className="p-4 font-semibold text-white">
                      {c.policy?.customer?.name || "Customer Account"}
                    </td>
                    <td className="p-4 font-semibold text-emerald-400">${c.claimAmount}</td>
                    <td className="p-4 text-xs text-slate-300 max-w-xs truncate" title={c.reason}>
                      {c.reason}
                    </td>
                    <td className="p-4">{claimStatusBadge(c.status)}</td>
                    {canDecide && (
                      <td className="p-4 text-right space-x-2">
                        {c.status === "PENDING" ? (
                          <>
                            <button
                              onClick={() => decide(c.id, "APPROVED")}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => decide(c.id, "REJECTED")}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Decision Recorded</span>
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
