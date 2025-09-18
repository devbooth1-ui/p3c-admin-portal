import React, { useEffect, useState } from "react";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/players", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch players");
        setPlayers(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      <ul className="space-y-2">
        {players.map(p => (
          <li key={p.player_id} className="bg-white border rounded p-2">
            {p.first_name} {p.last_name} — {p.email} — {p.phone}
          </li>
        ))}
        {!loading && !error && players.length === 0 && (
          <li className="text-gray-500">No players found.</li>
        )}
      </ul>
    </div>
  );
}
