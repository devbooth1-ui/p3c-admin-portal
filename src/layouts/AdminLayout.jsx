import { NavLink, Outlet } from "react-router-dom";

const nav = [
  { to: "/", label: "Dashboard", exact: true },
  { to: "/courses", label: "Courses" },
  { to: "/payouts", label: "Payouts" },
  { to: "/crm", label: "CRM" },
  { to: "/settings", label: "Settings" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <aside className="w-64 shrink-0 border-r bg-white">
        <div className="px-5 py-4 border-b">
          <div className="text-lg font-semibold">P3C Admin</div>
          <div className="text-xs text-gray-500">Vite + React Router</div>
        </div>
        <nav className="p-2 space-y-1">
          {nav.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                [
                  "block rounded-xl px-3 py-2 text-sm",
                  isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <h1 className="text-base font-medium">Par 3 Challenge — Admin Portal</h1>
            <div className="text-xs text-gray-500">Where Do I Stand?</div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
