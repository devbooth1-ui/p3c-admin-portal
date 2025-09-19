import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function AwardsClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/claims", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch claims");
        const data = await res.json();
        setClaims(data.claims || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, []);

  async function handleVerify(claim_id) {
    setVerifying(claim_id);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/claims/${claim_id}/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to verify claim");
      setClaims(claims => claims.map(c => c.claim_id === claim_id ? { ...c, status: "verified" } : c));
    } catch (e) {
      alert(e.message);
    } finally {
      setVerifying(null);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Award Claims</h2>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      <table className="w-full bg-white rounded shadow overflow-hidden mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Player</th>
            <th className="p-2 border">Course</th>
            <th className="p-2 border">Hole</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
            <th className="p-2 border">Details</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(claim => (
            <tr key={claim.claim_id} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{claim.player_first} {claim.player_last}</td>
              <td className="p-2 border">{claim.course_id}</td>
              <td className="p-2 border">{claim.hole}</td>
              <td className="p-2 border">{claim.claim_type}</td>
              <td className="p-2 border capitalize">{claim.status}</td>
              <td className="p-2 border">
                {claim.status === "pending" ? (
                  <button onClick={() => handleVerify(claim.claim_id)} disabled={verifying === claim.claim_id} className="bg-green-600 text-white px-3 py-1 rounded">
                    {verifying === claim.claim_id ? "Verifying…" : "Verify"}
                  </button>
                ) : (
                  <span className="text-green-700 font-semibold">Verified</span>
                )}
              </td>
              <td className="p-2 border">
                <NavLink to={`/admin/claims/${claim.claim_id}`} className="text-blue-600 underline">Details</NavLink>
              </td>
            </tr>
          ))}
          {!loading && !error && claims.length === 0 && (
            <tr><td className="p-4 text-center text-gray-500" colSpan="7">No claims found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
