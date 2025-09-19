import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noToken, setNoToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setNoToken(true);
      return;
    }
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        setStats(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (noToken) return <Navigate to="/admin/login" replace />;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-600">Snapshot of courses, payouts, claims, and recent activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Active Courses</div>
          <div className="text-3xl font-semibold mt-2">{loading ? "…" : error ? "-" : stats?.courses ?? 0}</div>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Players</div>
          <div className="text-3xl font-semibold mt-2">{loading ? "…" : error ? "-" : stats?.players ?? 0}</div>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Claims Pending</div>
          <div className="text-3xl font-semibold mt-2">{loading ? "…" : error ? "-" : stats?.claims_pending ?? 0}</div>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Payouts Sent</div>
          <div className="text-3xl font-semibold mt-2">{loading ? "…" : error ? "-" : `$${((stats?.total_payouts ?? 0)/100).toLocaleString()}`}</div>
        </div>
      </div>
      {error && <div className="text-red-600">Error: {error}</div>}
    </section>
  );
}
