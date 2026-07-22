import React, { useEffect, useState } from "react";
import { UserPlus, Search, Mail, Phone, MapPin, Calendar, FileText, Upload, Shield, X, Eye, Edit3, UserCheck } from "lucide-react";
import api from "../api/client";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerDocs, setCustomerDocs] = useState([]);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/customers", { params: { search: search || undefined } });
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [search]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await api.post("/customers", form);
      setForm({ name: "", dob: "", phone: "", address: "", email: "", password: "" });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register customer");
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingCustomer) return;
    try {
      await api.put(`/customers/${editingCustomer.id}`, {
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        address: editingCustomer.address,
        dob: editingCustomer.dob,
      });
      setEditingCustomer(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update customer");
    }
  }

  async function viewCustomerDetails(customer) {
    setSelectedCustomer(customer);
    try {
      const { data } = await api.get(`/documents/customer/${customer.id}`);
      setCustomerDocs(data || []);
    } catch (err) {
      setCustomerDocs([]);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="text-brand-400" /> Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Register new customer profiles, view policy histories, and upload identity documents.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all glow-btn"
        >
          <UserPlus size={16} /> {showForm ? "Cancel Registration" : "Register Customer"}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Registration Form Modal/Card */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 border border-brand-500/30 space-y-4 max-w-3xl animate-in fade-in slide-in-from-top-4 duration-200">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus size={18} className="text-brand-400" /> Register New Policyholder
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                placeholder="e.g. Eleanor Vance"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="eleanor@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                placeholder="+1 555-0199"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
              <input
                placeholder="Residential Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Password</label>
              <input
                type="password"
                placeholder="Customer login password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
              >
                Save Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">DOB</th>
                <th className="p-4">Address</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-xs border border-brand-500/30">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Mail size={12} className="text-slate-400" /> {c.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone size={12} className="text-slate-400" /> {c.phone}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      {new Date(c.dob).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-xs text-slate-300 max-w-xs truncate">
                      {c.address}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => viewCustomerDetails(c)}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-medium transition-all"
                        title="View Profile & Documents"
                      >
                        <Eye size={14} className="inline mr-1" /> View
                      </button>
                      <button
                        onClick={() => setEditingCustomer(c)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-medium transition-all"
                        title="Edit Customer"
                      >
                        <Edit3 size={14} className="inline mr-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-xl w-full rounded-2xl p-6 border border-slate-700 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-base border border-brand-500/30">
                {selectedCustomer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-400">Customer ID #{selectedCustomer.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1"><Mail size={12} /> Email</span>
                <p className="font-semibold text-white">{selectedCustomer.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1"><Phone size={12} /> Phone</span>
                <p className="font-semibold text-white">{selectedCustomer.phone}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 col-span-2">
                <span className="text-slate-400 flex items-center gap-1"><MapPin size={12} /> Address</span>
                <p className="font-semibold text-white">{selectedCustomer.address}</p>
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-brand-400" /> Attached Documents
              </h4>
              {customerDocs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No identity or policy documents attached yet.</p>
              ) : (
                <div className="space-y-2">
                  {customerDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <span className="text-slate-200 font-medium truncate max-w-xs">{doc.fileName}</span>
                      <a
                        href={`http://localhost:5000/api/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white font-semibold text-[11px]"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdate} className="glass-card max-w-md w-full rounded-2xl p-6 border border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 size={18} className="text-amber-400" /> Edit Customer Profile
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                value={editingCustomer.name}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
              <input
                value={editingCustomer.phone}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
              <input
                value={editingCustomer.address}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
