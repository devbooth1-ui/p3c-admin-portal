import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import Courses from "./pages/Courses.jsx";
import PlayerHome from "./pages/PlayerHome.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <div style={{padding:16, borderBottom:"1px solid #ddd"}}>
        <Link to="/" style={{marginRight:12}}>Home</Link>
        <Link to="/courses">Courses</Link>
      </div>
      <Routes>
        <Route path="/" element={<PlayerHome/>}/>
        <Route path="/courses" element={<Courses/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
