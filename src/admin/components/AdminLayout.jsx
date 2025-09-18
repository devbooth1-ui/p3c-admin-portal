import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const linkBase = "px-3 py-2 rounded-md text-sm font-medium";
const active = "bg-green-700 text-white";
const inactive = "text-white/90 hover:bg-green-700";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-green-900 text-white p-4">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="Par 3 Challenge" className="h-8 w-8 rounded-full bg-white" />
          <h1 className="text-xl font-bold">Par3 Admin</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/admin/dashboard" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Dashboard</NavLink>
          <NavLink to="/admin/players" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Players</NavLink>
          <NavLink to="/admin/claims" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Award Claims</NavLink>
          <NavLink to="/admin/accounting" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Accounting</NavLink>
          <NavLink to="/admin/courses" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Courses</NavLink>
          <NavLink to="/admin/campaigns" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Promos/Campaigns</NavLink>
          <NavLink to="/admin/crm" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>CRM</NavLink>
          <NavLink to="/admin/tournaments" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Tournaments</NavLink>
          <NavLink to="/admin/reports" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Reports</NavLink>
          <NavLink to="/admin/settings" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Settings</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
