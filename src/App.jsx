import React from "react";
import { Link } from "react-router-dom";

export default function App(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold">Par3 Challenge</h1>
        <p>Welcome! Use the Admin Portal to manage courses, players & accounting.</p>
        <Link to="/admin" className="inline-block bg-green-700 text-white px-4 py-2 rounded">
          Go to Admin
        </Link>
      </div>
    </div>
  );
}
