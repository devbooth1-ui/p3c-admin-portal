import React, { useEffect, useState } from "react";

export default function PlayerNotifications({ email, phone }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (phone) params.append('phone', phone);
        const res = await fetch(`/api/player/notifications?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [email, phone]);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-2">Your Awards & Notifications</h2>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {notifications.map(n => (
        <div key={n.id} className="bg-white rounded shadow p-4 space-y-2">
          <div className="font-semibold">{n.title}</div>
          <div>{n.message}</div>
          {n.qr_code && (
            <div><img src={n.qr_code} alt="Award QR Code" className="w-32 h-32 mt-2" /></div>
          )}
          <a href={`/award/${n.claim_id}`} className="text-blue-600 underline">Click for details</a>
        </div>
      ))}
      {!loading && notifications.length === 0 && <div className="text-gray-500">No awards or notifications yet.</div>}
    </div>
  );
}
