import React from "react";
import AdminLayout from "./components/AdminLayout";
import Courses from "./pages/Courses";
import Players from "./pages/Players";
import Reports from "./pages/Reports";
import AwardsClaims from "./pages/AwardsClaims";
import Settings from "./pages/Settings";
import Accounting from "./pages/Accounting";
import AwardDetails from "./pages/AwardDetails";
import TournamentAdmin from "./pages/TournamentAdmin";
import SpecialsCampaigns from "./pages/SpecialsCampaigns";
import Dashboard from "../pages/Dashboard";
import CRM from "../pages/CRM";

export const adminRoutes = [{
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "players", element: <Players /> },
    { path: "claims", element: <AwardsClaims /> },
    { path: "claims/:claimId", element: <AwardDetails /> },
    { path: "accounting", element: <Accounting /> },
    { path: "courses", element: <Courses /> },
    { path: "campaigns", element: <SpecialsCampaigns /> },
    { path: "crm", element: <CRM /> },
    { path: "tournaments", element: <TournamentAdmin /> },
    { path: "reports", element: <Reports /> },
    { path: "settings", element: <Settings /> },
  ],
}];
