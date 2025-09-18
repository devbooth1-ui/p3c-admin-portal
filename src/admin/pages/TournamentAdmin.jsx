import React, { useEffect, useState } from "react";

export default function TournamentAdmin() {
  const [tournament, setTournament] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchTournament() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("admin_token");
        const tRes = await fetch("/api/tournaments", { headers: { Authorization: `Bearer ${token}` } });
        if (!tRes.ok) throw new Error("Failed to fetch tournament");
        const tData = await tRes.json();
        setTournament(tData[0] || null);
        setRegistrants((tData[0]?.registrants) || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTournament();
  }, []);

  async function handleSendNotification(type) {
    setSending(true);
    try {
      const token = localStorage.getItem("admin_token");
      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: "Tournament Update",
          message,
          target: type
        })
      });
      setMessage("");
      alert("Notification sent!");
    } catch (e) {
      alert(e.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!tournament) return <div>No tournament found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2">$1M Hole-in-One Shootout</h2>
      <div className="bg-white rounded shadow p-4 space-y-2">
        <div><b>Name:</b> {tournament.name}</div>
        <div><b>Date:</b> {tournament.date}</div>
        <div><b>Prize:</b> {tournament.prize}</div>
        <div><b>Status:</b> {tournament.status}</div>
        {/* Add edit functionality as needed */}
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-bold mb-2">Current Registrants</h3>
        <ul className="space-y-1">
          {registrants.length === 0 && <li className="text-gray-500">No registrants yet.</li>}
          {registrants.map(r => (
            <li key={r.id}>{r.name} ({r.email}) — {r.course}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded shadow p-4 space-y-2">
        <h3 className="font-bold mb-2">Send Notification</h3>
        <textarea className="border p-2 w-full" rows={3} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Type your message…" />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={sending} onClick={()=>handleSendNotification('all')}>To All Players</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={sending} onClick={()=>handleSendNotification('near-qual')}>To Near-Qualified</button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded" disabled={sending} onClick={()=>handleSendNotification('courses')}>To Courses</button>
        </div>
      </div>
    </div>
  );
}
