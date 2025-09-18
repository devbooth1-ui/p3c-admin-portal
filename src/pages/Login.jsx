import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("admin_token", data.token);
      // Immediately redirect to dashboard after login
      window.location.href = "/admin/dashboard";
      if (onLogin) onLogin();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-xs w-full space-y-4">
        <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
        <input className="border p-2 w-full" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="bg-green-700 text-white px-4 py-2 rounded w-full" disabled={loading}>{loading ? "Logging in…" : "Login"}</button>
        <div className="text-xs text-gray-400 mt-2">Demo: admin@p3c.com / admin123</div>
      </form>
    </div>
  );
}
