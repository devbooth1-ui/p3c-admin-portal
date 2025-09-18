import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import Courses from "./pages/Courses.jsx";

function Home() {
  return (
    <div style={{padding:24}}>
      <h1>Home</h1>
      <p>Router OK.</p>
      <p><Link to="/courses">Go to Courses</Link></p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <div style={{padding:16, borderBottom:"1px solid #ddd"}}>
        <Link to="/" style={{marginRight:12}}>Home</Link>
        <Link to="/courses">Courses</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/courses" element={<Courses/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
