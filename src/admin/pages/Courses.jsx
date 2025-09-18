import React, { useEffect, useState } from "react";
import MapWidget from "../components/MapWidget";

const initialForm = {
  name: "",
  city: "",
  contact: "",
  email: "",
  phone: "",
  holes: "",
  yardage: "",
  lat: "",
  lng: "",
  geofence: 200,
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selected, setSelected] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("par3-courses");
    setCourses(saved ? JSON.parse(saved) : []);
  }, []);
  useEffect(() => {
    localStorage.setItem("par3-courses", JSON.stringify(courses));
  }, [courses]);

  async function handleGeocode() {
    setLocating(true);
    try {
      const q = encodeURIComponent(`${form.name} ${form.city}`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`);
      const data = await res.json();
      if (data[0]) {
        setForm(f => ({ ...f, lat: data[0].lat, lng: data[0].lon }));
      } else {
        alert("Location not found. Please adjust manually.");
      }
    } catch {
      alert("Geocoding failed.");
    } finally {
      setLocating(false);
    }
  }

  function handleAddCourse(e) {
    e.preventDefault();
    const newCourse = {
      id: Date.now(),
      ...form,
      holes: Number(form.holes || 0),
      yardage: Number(form.yardage || 0),
      geofence: Number(form.geofence || 200),
    };
    setCourses(prev => [...prev, newCourse]);
    setForm(initialForm);
    setShowForm(false);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Courses</h2>
          <button onClick={() => setShowForm(v => !v)} className="bg-green-600 text-white px-4 py-2 rounded">
            {showForm ? "Cancel" : "➕ Add Course"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddCourse} className="space-y-3 mb-6 bg-white p-4 rounded shadow">
            <input className="border p-2 w-full" placeholder="Course Name" value={form.name}
                   onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input className="border p-2 w-full" placeholder="City" value={form.city}
                   onChange={e => setForm({ ...form, city: e.target.value })} required />
            <input className="border p-2 w-full" placeholder="Contact Name" value={form.contact}
                   onChange={e => setForm({ ...form, contact: e.target.value })} />
            <input className="border p-2 w-full" placeholder="Contact Email" value={form.email}
                   onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="border p-2 w-full" placeholder="Contact Phone" value={form.phone}
                   onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input className="border p-2 w-full" type="number" placeholder="Holes" value={form.holes}
                   onChange={e => setForm({ ...form, holes: e.target.value })} min="1" max="27" required />
            <input className="border p-2 w-full" type="number" placeholder="Yardage" value={form.yardage}
                   onChange={e => setForm({ ...form, yardage: e.target.value })} min="1" />
            <div className="flex gap-2">
              <input className="border p-2 flex-1" placeholder="Latitude" value={form.lat} readOnly />
              <input className="border p-2 flex-1" placeholder="Longitude" value={form.lng} readOnly />
              <input className="border p-2 flex-1" type="number" placeholder="Geofence (meters)" value={form.geofence}
                     onChange={e => setForm({ ...form, geofence: e.target.value })} min="50" />
              <button type="button" className="bg-purple-600 text-white px-3 rounded" onClick={handleGeocode} disabled={locating}>
                {locating ? "Locating…" : "📍 Auto-Locate"}
              </button>
            </div>
            <MapWidget lat={form.lat} lng={form.lng} label={form.name} />
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
