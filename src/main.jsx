import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./index.css";
import Courses from "./pages/Courses.jsx";
import PlayerHome from "./pages/PlayerHome.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import { adminRoutes } from "./admin/routes.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("admin_token");
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      {/* Admin routes, protected */}
      <Route path="/admin/*" element={<RequireAuth>{adminRoutes[0].element}</RequireAuth>}>
        {adminRoutes[0].children.map((r, i) => (
          <Route key={i} index={r.index} path={r.path} element={r.element} />
        ))}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
