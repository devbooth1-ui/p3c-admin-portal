import React, { useEffect, useState } from "react";

export default function SpecialsCampaigns() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState("");
  const [form, setForm] = useState({ title: "", message: "", type: "special", status: "draft" });
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/courses", { headers: { Authorization: `Bearer ${token}` } });
        setCourses(await res.json());
      } catch (e) {
        setError("Could not load courses");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  async function handleCreateCampaign(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, course_id: selected })
      });
      const data = await res.json();
      setCampaigns(c => [data, ...c]);
      setForm({ title: "", message: "", type: "special", status: "draft" });
    } catch (e) {
      alert("Failed to create campaign");
    }
  }

  async function handleSendForApproval(id) {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/campaigns/${id}/send-for-approval`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: "pending-approval", last_action: "Sent for approval (demo)" } : c));
  }

  async function handleApprove(id) {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/campaigns/${id}/approve`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: "approved", last_action: "Approved by CRM (demo)" } : c));
  }

  async function handleLaunch(id) {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/campaigns/${id}/launch`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: "launched", last_action: "Launched to players (demo)" } : c));
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2">Specials & Campaigns</h2>
      <form onSubmit={handleCreateCampaign} className="bg-white rounded shadow p-4 space-y-3">
        <select className="border p-2 w-full" value={selected} onChange={e=>setSelected(e.target.value)} required>
          <option value="">Select Course…</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.city})</option>)}
        </select>
        <input className="border p-2 w-full" placeholder="Title" value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} required />
        <textarea className="border p-2 w-full" rows={3} placeholder="Message/Details" value={form.message} onChange={e=>setForm({ ...form, message: e.target.value })} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Campaign</button>
      </form>
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-bold mb-2">Campaigns</h3>
        <ul className="space-y-2">
          {campaigns.length === 0 && <li className="text-gray-500">No campaigns yet.</li>}
          {campaigns.map(c => (
            <li key={c.id} className="border rounded p-2 flex flex-col gap-1">
              <div><b>{c.title}</b> ({c.type})</div>
              <div>{c.message}</div>
              <div className="text-xs text-gray-500">Status: {c.status}</div>
              {c.status === "draft" && <button className="bg-purple-600 text-white px-2 py-1 rounded w-max" onClick={()=>handleSendForApproval(c.id)}>Send for Approval</button>}
              {c.status === "pending-approval" && <button className="bg-yellow-600 text-white px-2 py-1 rounded w-max" onClick={()=>handleApprove(c.id)}>Approve</button>}
              {c.status === "approved" && <button className="bg-green-600 text-white px-2 py-1 rounded w-max" onClick={()=>handleLaunch(c.id)}>Launch</button>}
              {c.last_action && <div className="text-xs text-gray-400">{c.last_action}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
