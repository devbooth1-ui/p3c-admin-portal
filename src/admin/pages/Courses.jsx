import React, { useEffect, useState } from "react";
import MapWidget from "../components/MapWidget";
import { courses as seed } from "../lib/data";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", holes:"", location:"", lat:"", lng:"" });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("par3-courses");
    setCourses(saved ? JSON.parse(saved) : seed);
  }, []);
  useEffect(() => {
    localStorage.setItem("par3-courses", JSON.stringify(courses));
  }, [courses]);

  function handleAddCourse(e){
    e.preventDefault();
    const newCourse = {
      id: Date.now(),
      name: form.name.trim(),
      holes: Number(form.holes||0),
      location: form.location.trim(),
      lat: form.lat, lng: form.lng
    };
    setCourses(prev => [...prev, newCourse]);
    setForm({ name:"", holes:"", location:"", lat:"", lng:"" });
    setShowForm(false);
  }

  function handleLocate(){
    if(!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm(f => ({...f,
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6)
      })),
      (err) => alert("Location error: " + err.message),
      { enableHighAccuracy:true, timeout:8000, maximumAge:0 }
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Courses</h2>
          <button onClick={()=>setShowForm(v=>!v)} className="bg-green-600 text-white px-4 py-2 rounded">
            {showForm ? "Cancel" : "➕ Add Course"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddCourse} className="space-y-3 mb-6 bg-white p-4 rounded shadow">
            <input className="border p-2 w-full" placeholder="Course Name" value={form.name}
                   onChange={e=>setForm({...form, name:e.target.value})} required />
            <input className="border p-2 w-full" type="number" placeholder="Holes" value={form.holes}
                   onChange={e=>setForm({...form, holes:e.target.value})} min="1" max="27" required />
            <input className="border p-2 w-full" placeholder="Location (City, ST)" value={form.location}
                   onChange={e=>setForm({...form, location:e.target.value})} required />
            <div className="flex gap-2">
              <input className="border p-2 flex-1" placeholder="Latitude" value={form.lat} readOnly />
              <input className="border p-2 flex-1" placeholder="Longitude" value={form.lng} readOnly />
              <button type="button" className="bg-purple-600 text-white px-3 rounded" onClick={handleLocate}>📍</button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Course</button>
          </form>
        )}

        <table className="w-full bg-white rounded shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Holes</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Lat/Lng</th>
              <th className="p-2 border">Map</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border font-medium">{c.name}</td>
                <td className="p-2 border">{c.holes}</td>
                <td className="p-2 border">{c.location}</td>
                <td className="p-2 border text-sm">{c.lat ?? "—"}, {c.lng ?? "—"}</td>
                <td className="p-2 border">
                  <button
                    onClick={()=>setSelected(c)}
                    className="text-blue-600 underline disabled:text-gray-400"
                    disabled={!c.lat || !c.lng}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td className="p-4 text-center text-gray-500" colSpan="5">No courses yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Map</h3>
        {selected ? (
          <MapWidget lat={selected.lat} lng={selected.lng} label={selected.name} />
        ) : (
          <div className="text-gray-500">Select “View” to show a course on the map.</div>
        )}
      </div>
    </div>
  );
}
