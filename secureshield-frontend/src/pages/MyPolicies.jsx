import React, { useEffect, useState } from "react";
import { Shield, Calendar, DollarSign, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import api from "../api/client";

export default function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/policies")
      .then(({ data }) => setPolicies(data.policies || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">Active Coverage</span>;
      case "EXPIRED":
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">Expired</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Shield className="text-brand-400" /> My Insurance Policies
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          View your registered policy coverage, premium payment terms, and validity dates.
        </p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Policy #</th>
                <th className="p-4">Policy Type</th>
                <th className="p-4">Premium Amount</th>
                <th className="p-4">Effective Date</th>
                <th className="p-4">Expiration Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading your policies...
                  </td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    You do not have any registered policies yet.
                  </td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-300">{p.policyNumber}</td>
                    <td className="p-4 font-semibold text-white">{p.policyType}</td>
                    <td className="p-4 font-semibold text-emerald-400">${p.premiumAmount}</td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(p.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(p.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{statusBadge(p.status)}</td>
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
