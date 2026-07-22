import React, { useEffect, useState } from "react";
import { Users, UserPlus, Search, Mail, Phone, MapPin, Edit3, Eye, FileText, Download, X } from "lucide-react";
import api from "../api/client";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Detail Drawer state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDocs, setCustomerDocs] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    password: "Customer@123",
  });

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/customers", { params: { search, limit: 100 } });
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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, form);
      } else {
        await api.post("/customers", form);
      }
      setForm({ name: "", email: "", phone: "", dob: "", address: "", password: "Customer@123" });
      setShowForm(false);
      setEditingId(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  }

  function startEdit(c) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      dob: c.dob ? new Date(c.dob).toISOString().slice(0, 10) : "",
      address: c.address || "",
      password: "",
    });
    setShowForm(true);
  }

  async function openDetail(customer) {
    setSelectedCustomer(customer);
    try {
      const { data } = await api.get(`/documents/customer/${customer.id}`);
      setCustomerDocs(data || []);
    } catch (err) {
      setCustomerDocs([]);
    }
  }

  async function downloadDoc(docId, fileName) {
    try {
      const res = await api.get(`/documents/${docId}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download document");
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-blue-600" /> Customer Management Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Register policyholders, edit client profiles, search records, and manage attached documents.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ name: "", email: "", phone: "", dob: "", address: "", password: "Customer@123" });
            setShowForm((s) => !s);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <UserPlus size={16} /> {showForm ? "Close Form" : "Register New Customer"}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
        />
      </div>

      {/* Registration/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-blue-200 space-y-4 max-w-3xl shadow-md animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserPlus size={18} className="text-blue-600" /> {editingId ? "Edit Customer Info" : "Register New Policyholder"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                placeholder="e.g. Suvetha"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="suvetha@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                placeholder="+1 555-0199"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
              <input
                placeholder="12 Jasmine Gardens, Chennai"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white"
                required
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Save Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">DOB</th>
                <th className="p-4">Address</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    Loading customer directory...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/60 transition-colors">
                    {/* CUSTOMER NAME - HIGH CONTRAST DARK BLUE BOLD TEXT */}
                    <td className="p-4 font-extrabold text-blue-950 text-sm sm:text-base">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm tracking-tight">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                        <Mail size={13} className="text-blue-600" /> {c.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Phone size={13} className="text-slate-500" /> {c.phone}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-700">
                      {new Date(c.dob).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-700 max-w-xs truncate">
                      {c.address}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openDetail(c)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all"
                      >
                        <Eye size={13} className="inline mr-1" /> View
                      </button>
                      <button
                        onClick={() => startEdit(c)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all"
                      >
                        <Edit3 size={13} className="inline mr-1" /> Edit
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-slate-200 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-md">
                {selectedCustomer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-xs font-bold text-blue-600">Customer ID #{selectedCustomer.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 flex items-center gap-1 font-semibold"><Mail size={12} /> Email</span>
                <p className="font-bold text-slate-900">{selectedCustomer.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 flex items-center gap-1 font-semibold"><Phone size={12} /> Phone</span>
                <p className="font-bold text-slate-900">{selectedCustomer.phone}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 col-span-2">
                <span className="text-slate-500 flex items-center gap-1 font-semibold"><MapPin size={12} /> Address</span>
                <p className="font-bold text-slate-900">{selectedCustomer.address}</p>
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-blue-600" /> Attached Documents
              </h4>
              {customerDocs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No identity or policy documents attached yet.</p>
              ) : (
                <div className="space-y-2">
                  {customerDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-800 font-bold truncate max-w-xs">{doc.fileName}</span>
                      <button
                        onClick={() => downloadDoc(doc.id, doc.fileName)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm transition-all"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
