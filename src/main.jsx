import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
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

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <div style={{padding:16, borderBottom:"1px solid #ddd"}}>
        <Link to="/" style={{marginRight:12}}>Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/admin/dashboard" style={{marginLeft:12}}>Admin</Link>
        <Link to="/login" style={{marginLeft:12}}>Login</Link>
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PlayerHome/>}/>
        <Route path="/courses" element={<Courses/>}/>
        {/* Admin routes, protected */}
        <Route path="/admin/*" element={<RequireAuth>{adminRoutes[0].element}</RequireAuth>}>
          {adminRoutes[0].children.map((r, i) => (
            <Route key={i} index={r.index} path={r.path} element={r.element} />
          ))}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
