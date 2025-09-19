import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Players from "./admin/pages/Players";
import Claims from "./admin/pages/AwardsClaims";
import Settings from "./admin/pages/Settings";
import Login from "./pages/Login";
import Courses from "./admin/pages/Courses";
import Accounting from "./admin/pages/Accounting";
import Reports from "./admin/pages/Reports";
import SpecialsCampaigns from "./admin/pages/SpecialsCampaigns";
import CRM from "./pages/CRM";
import TournamentAdmin from "./admin/pages/TournamentAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="players" element={<Players />} />
        <Route path="claims" element={<Claims />} />
        <Route path="courses" element={<Courses />} />
        <Route path="accounting" element={<Accounting />} />
        <Route path="reports" element={<Reports />} />
        <Route path="campaigns" element={<SpecialsCampaigns />} />
        <Route path="crm" element={<CRM />} />
        <Route path="tournaments" element={<TournamentAdmin />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
}
