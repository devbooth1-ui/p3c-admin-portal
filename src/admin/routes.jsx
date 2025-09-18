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

export const adminRoutes = [{
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "courses", element: <Courses /> },
    { path: "players", element: <Players /> },
    { path: "reports", element: <Reports /> },
    { path: "claims", element: <AwardsClaims /> },
    { path: "claims/:claimId", element: <AwardDetails /> },
    { path: "accounting", element: <Accounting /> },
    { path: "settings", element: <Settings /> },
    { path: "tournaments", element: <TournamentAdmin /> },
    { path: "campaigns", element: <SpecialsCampaigns /> },
  ],
}];
