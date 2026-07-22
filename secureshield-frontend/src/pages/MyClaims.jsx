import React, { useEffect, useState } from "react";
import { FileSpreadsheet, CheckCircle2, XCircle, Clock } from "lucide-react";
import api from "../api/client";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/claims")
      .then(({ data }) => setClaims(data.claims || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const claimStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle2 size={12} /> Claim Approved</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><XCircle size={12} /> Claim Rejected</span>;
      case "PENDING":
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock size={12} /> Under Verification</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="text-brand-400" /> My Claim Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Track real-time verification and approval progress for your submitted insurance claims.
        </p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Claim ID</th>
                <th className="p-4">Policy #</th>
                <th className="p-4">Claim Amount</th>
                <th className="p-4">Reason / Description</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading your claims...
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    You have not filed any insurance claims yet.
                  </td>
                </tr>
              ) : (
                claims.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-400">#{c.id}</td>
                    <td className="p-4 font-mono font-bold text-brand-300">{c.policy?.policyNumber}</td>
                    <td className="p-4 font-semibold text-emerald-400">${c.claimAmount}</td>
                    <td className="p-4 text-xs text-slate-300 max-w-xs truncate" title={c.reason}>
                      {c.reason}
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(c.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{claimStatusBadge(c.status)}</td>
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
