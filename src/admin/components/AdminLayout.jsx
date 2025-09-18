import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const linkBase = "px-3 py-2 rounded-md text-sm font-medium";
const active = "bg-green-700 text-white";
const inactive = "text-white/90 hover:bg-green-700";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-green-900 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Par3 Admin</h1>
        <nav className="flex flex-col gap-2">
          <NavLink to="/admin/courses" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Courses</NavLink>
          <NavLink to="/admin/players" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Players</NavLink>
          <NavLink to="/admin/reports" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Reports</NavLink>
          <NavLink to="/admin/claims" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Award Claims</NavLink>
          <NavLink to="/admin/accounting" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Accounting</NavLink>
          <NavLink to="/admin/settings" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Settings</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
