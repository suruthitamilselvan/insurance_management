import React, { useEffect, useState } from "react";
import { FilePlus2, Filter, RefreshCw, XCircle, ShieldCheck, AlertCircle, Calendar, DollarSign, Download, Search, X, FileText } from "lucide-react";
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

  // Instructor Demo Modals
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [upcomingTab, setUpcomingTab] = useState(30);
  const [modalSearch, setModalSearch] = useState("");

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

  async function downloadReport(reportType) {
    try {
      const res = await api.get("/reports/export/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportType}-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download report");
    }
  }

  const statusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">Active</span>;
      case "EXPIRED":
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold uppercase tracking-wider">Expired</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{status}</span>;
    }
  };

  const expiredAndExpiringPolicies = policies.filter((p) => {
    const matchesSearch = p.customer?.name?.toLowerCase().includes(modalSearch.toLowerCase()) || p.policyNumber?.toLowerCase().includes(modalSearch.toLowerCase());
    const isExp = p.status === "EXPIRED" || new Date(p.endDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return matchesSearch && isExp;
  });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Policy Management Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Issue policies, track expiration dates, process renewals, and generate report downloads.
          </p>
        </div>
        {isStaff && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUpcomingModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold transition-all shadow-sm"
            >
              <Calendar size={14} className="text-blue-600" /> Upcoming Renewals
            </button>
            <button
              onClick={() => setShowExpiryModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold transition-all shadow-sm"
            >
              <AlertCircle size={14} className="text-amber-600" /> Policy Expiry Report
            </button>
            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <FilePlus2 size={16} /> {showForm ? "Cancel Creation" : "Issue New Policy"}
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400 ml-2" />
          <button
            onClick={() => { setExpiringSoonFilter(false); setStatusFilter(""); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!expiringSoonFilter && statusFilter === "" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            All Policies
          </button>
          <button
            onClick={() => { setExpiringSoonFilter(false); setStatusFilter("ACTIVE"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!expiringSoonFilter && statusFilter === "ACTIVE" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Active
          </button>
          <button
            onClick={() => { setExpiringSoonFilter(false); setStatusFilter("EXPIRED"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!expiringSoonFilter && statusFilter === "EXPIRED" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Expired
          </button>

          {isStaff && (
            <button
              onClick={() => setExpiringSoonFilter((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${expiringSoonFilter ? "bg-orange-600 text-white" : "text-orange-700 bg-orange-50 border border-orange-200"}`}
            >
              <AlertCircle size={14} /> Expiring Soon (30 Days)
            </button>
          )}
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px]">
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
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={isStaff ? 7 : 6} className="p-8 text-center text-slate-500 font-medium">
                    Loading policy records...
                  </td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={isStaff ? 7 : 6} className="p-8 text-center text-slate-500 font-medium">
                    No policy records found.
                  </td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-700">{p.policyNumber}</td>
                    <td className="p-4 font-extrabold text-slate-900 text-sm">
                      {p.customer?.name || `Customer #${p.customerId}`}
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-700">{p.policyType}</td>
                    <td className="p-4 font-extrabold text-emerald-700">${p.premiumAmount}</td>
                    <td className="p-4 text-xs font-medium text-slate-600">
                      {new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{statusBadge(p.status)}</td>
                    {isStaff && (
                      <td className="p-4 text-right space-x-2">
                        {p.status === "ACTIVE" && (
                          <>
                            <button
                              onClick={() => renew(p.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all"
                            >
                              <RefreshCw size={12} className="inline mr-1" /> Renew
                            </button>
                            <button
                              onClick={() => cancel(p.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
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
