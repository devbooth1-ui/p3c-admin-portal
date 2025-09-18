export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-600">Snapshot of courses, payouts, claims, and recent activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Active Courses", "Today’s Players", "Claims Pending", "Payouts Sent"].map((t) => (
          <div key={t} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{t}</div>
            <div className="text-3xl font-semibold mt-2">—</div>
          </div>
        ))}
      </div>
    </section>
  );
}
