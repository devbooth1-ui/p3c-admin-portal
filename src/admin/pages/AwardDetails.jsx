import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function AwardDetails() {
  const { claimId } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClaim() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`/api/admin/claims`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch claims");
        const data = await res.json();
        const found = (data.claims || []).find(c => c.claim_id === claimId);
        setClaim(found || null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClaim();
  }, [claimId]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!claim) return <div className="text-gray-500">Claim not found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Award Details</h2>
      <div><b>Player:</b> {claim.player_first} {claim.player_last}</div>
      <div><b>Email:</b> {claim.email || "-"}</div>
      <div><b>Phone:</b> {claim.phone || "-"}</div>
      <div><b>Course/Club:</b> {claim.course_id}</div>
      <div><b>Hole:</b> {claim.hole}</div>
      <div><b>Type:</b> {claim.claim_type}</div>
      <div><b>Status:</b> {claim.status}</div>
      {claim.qr_code && (
        <div>
          <b>QR Code:</b>
          <div><img src={claim.qr_code} alt="Award QR Code" className="w-40 h-40 mt-2" /></div>
        </div>
      )}
      {claim.claim_type === 'hole-in-one' && (
        <div className="text-green-700 font-semibold">$1000.00 payout sent to player’s payment method.</div>
      )}
      <div className="bg-gray-100 p-3 rounded">
        <b>Notification sent:</b><br/>
        {claim.claim_type === 'birdie'
          ? 'You scored a birdie! Use this QR code at your club to redeem your $65 award. Enjoy!'
          : 'Great Job! $1000.00 has been sent back to the method of payment you used to enter the challenge.'}
      </div>
      <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
        <b>Video Verification:</b> (coming soon)
      </div>
      <Link to="/admin/claims" className="text-blue-600 underline">Back to Claims</Link>
    </div>
  );
}
