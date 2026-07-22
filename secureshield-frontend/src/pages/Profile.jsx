import React, { useState } from "react";
import { User, Upload, Shield, CheckCircle, Save, Mail, Phone, MapPin, Building, Share2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("branding");

  const [brandForm, setBrandForm] = useState({
    brandName: "NEM FINANCIAL & INSURANCE SERVICES",
    tagline: "NFA Certified Enterprise Advisor",
    bio: "I am a certified financial & insurance expert specializing in Health, Life, Auto, and Property coverage. Connect with me to discover tailored insurance plans that protect your family's future.",
    phone: "+1 555-0199",
    email: user?.email || "suruthi@secureshield.test",
    address: "742 Evergreen Plaza, Suite 400",
  });

  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <User className="text-brand-400" /> Account & Branding Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your agent profile, enterprise brand details, logos, and custom referral link.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Avatar Sidebar + Right Tabbed Settings (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Profile Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 text-center space-y-4">
            {/* Avatar Ring */}
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 p-1 mx-auto shadow-xl shadow-brand-500/20">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-extrabold text-white">
                  {user?.name?.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Active Advisor" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white uppercase">{user?.name}</h2>
              <p className="text-xs font-semibold text-brand-400">ARN-{user?.id}88293 • Active Advisor</p>
              <p className="text-[11px] text-slate-400 mt-1">Partner Since • 23/03/2024</p>
            </div>

            <button
              onClick={() => alert("Referral profile link copied to clipboard!")}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
            >
              <Share2 size={14} /> Share Public Profile
            </button>
          </div>

          {/* Settings Sub-Nav Tabs (Matching Screenshot 2) */}
          <div className="glass-panel rounded-2xl p-2 border border-slate-800 space-y-1">
            <TabButton label="Personal Details" active={activeTab === "personal"} onClick={() => setActiveTab("personal")} />
            <TabButton label="Branding Details" active={activeTab === "branding"} onClick={() => setActiveTab("branding")} />
            <TabButton label="Nominee Information" active={activeTab === "nominee"} onClick={() => setActiveTab("nominee")} />
            <TabButton label="Bank Account Details" active={activeTab === "bank"} onClick={() => setActiveTab("bank")} />
            <TabButton label="Uploaded Documents" active={activeTab === "docs"} onClick={() => setActiveTab("docs")} />
          </div>
        </div>

        {/* Right Main Panel (Matching Screenshot 2 - Brand Details Form) */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Brand Details</h3>
                <p className="text-xs text-slate-400">Edit branding, logo, and business description displayed to clients</p>
              </div>
              {saved && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <CheckCircle size={14} /> Saved Successfully
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name *</label>
                  <input
                    value={brandForm.brandName}
                    onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline *</label>
                  <input
                    value={brandForm.tagline}
                    onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Bio / Description *</label>
                <textarea
                  rows={4}
                  value={brandForm.bio}
                  onChange={(e) => setBrandForm({ ...brandForm, bio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white leading-relaxed"
                  required
                />
              </div>

              {/* Logo & Banner Upload Dropzones (Matching Screenshot 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Logo</label>
                  <div className="border border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-900/60 hover:border-brand-500 transition-colors cursor-pointer space-y-2">
                    <Upload size={24} className="mx-auto text-brand-400" />
                    <p className="text-xs font-semibold text-slate-300">Upload Logo</p>
                    <p className="text-[10px] text-slate-500">PNG or SVG format (Max 2MB)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Banner</label>
                  <div className="border border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-900/60 hover:border-brand-500 transition-colors cursor-pointer space-y-2">
                    <Upload size={24} className="mx-auto text-brand-400" />
                    <p className="text-xs font-semibold text-slate-300">Upload Cover</p>
                    <p className="text-[10px] text-slate-500">JPG or PNG format (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Public Referral Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Referral Profile Link</label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`https://secureshield.app/mfo/ARN-${user?.id || 1}88293`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-brand-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => alert("Referral link copied!")}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => alert("Previewing client view...")}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
                >
                  Preview Client View
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-brand-500/20 flex items-center gap-1.5 glow-btn"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
        active
          ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
      }`}
    >
      {label}
      <span className="text-[10px]">›</span>
    </button>
  );
}
