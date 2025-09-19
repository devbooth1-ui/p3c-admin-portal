import React, { useState } from "react";
import MapWidget from "../components/MapWidget";
import { FiMapPin, FiPlus, FiUser, FiPhone, FiMail, FiBookOpen, FiUsers, FiAward, FiBarChart2 } from "react-icons/fi";

const initialForm = {
  name: "",
  city: "",
  state: "",
  headPro: "",
  director: "",
  email: "",
  phone: "",
  lat: "",
  lng: "",
  geofence: 200,
};

export default function Courses() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Wentworth Golf Club",
      city: "Tarpon Springs",
      state: "FL",
      headPro: "Jane Doe",
      director: "John Smith",
      phone: "(727) 942-4760",
      email: "info@wentworthgolfclub.org",
      lat: "28.1415",
      lng: "-82.7423",
      geofence: 200,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selected, setSelected] = useState(null);
  const [locating, setLocating] = useState(false);

  async function handleGeocode() {
    setLocating(true);
    try {
      const q = encodeURIComponent(`${form.name} ${form.city} ${form.state}`);
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
    setCourses(prev => [
      ...prev,
      { ...form, id: Date.now() }
    ]);
    setForm(initialForm);
    setShowForm(false);
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-slate-50 to-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-blue-900 to-blue-700 text-white flex flex-col py-8 px-6 shadow-xl">
        <div className="flex items-center mb-12">
          <FiBookOpen className="text-2xl mr-2" />
          <span className="font-extrabold text-2xl tracking-tight">P3C Admin</span>
        </div>
        <nav className="flex flex-col gap-4 text-lg font-medium">
          <a href="#" className="flex items-center gap-2 bg-blue-800/80 px-3 py-2 rounded-lg">
            <FiMapPin /> Courses
          </a>
          <a href="#" className="flex items-center gap-2 hover:bg-blue-800/50 px-3 py-2 rounded-lg">
            <FiUsers /> Players
          </a>
          <a href="#" className="flex items-center gap-2 hover:bg-blue-800/50 px-3 py-2 rounded-lg">
            <FiAward /> Award Claims
          </a>
          <a href="#" className="flex items-center gap-2 hover:bg-blue-800/50 px-3 py-2 rounded-lg">
            <FiBarChart2 /> Reports
          </a>
        </nav>
        <div className="flex-1" />
        <div className="mt-8 text-sm text-blue-100/70">© 2025 Par3 Challenge</div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-0 md:p-10">
        {/* Topbar */}
        <div className="flex items-center justify-between bg-white/90 px-6 py-4 shadow-sm border-b mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-800 tracking-tight flex items-center gap-2">
              <FiMapPin className="text-blue-600" /> Courses CRM
            </h1>
            <span className="text-gray-500 text-base hidden md:inline">Manage golf courses, pros, contacts, and mapping.</span>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-gradient-to-tr from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white px-5 py-2 rounded-lg shadow border-none font-semibold transition"
          >
            <FiPlus />
            {showForm ? "Cancel" : "Add Course"}
          </button>
        </div>

        {/* Example Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <FiMapPin size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold">{courses.length}</div>
              <div className="text-gray-500 text-sm">Total Courses</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              <FiUsers size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold">48</div>
              <div className="text-gray-500 text-sm">Active Players</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
              <FiAward size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-gray-500 text-sm">Award Claims</div>
            </div>
          </div>
        </div>

        {/* Add Course Form */}
        {showForm && (
          <form onSubmit={handleAddCourse} className="space-y-4 mb-10 bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <input className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-300" placeholder="Course Name" value={form.name}
                     onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-300" placeholder="City" value={form.city}
                     onChange={e => setForm({ ...form, city: e.target.value })} required />
              <input className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-300" placeholder="State" value={form.state}
                     onChange={e => setForm({ ...form, state: e.target.value })} maxLength={2} required />
              <input className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-300" placeholder="Head Pro" value={form.headPro}
                     onChange={e => setForm({ ...form, headPro: e.target.value })} />
              <input className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-300" placeholder="Director of Golf" value={form.director}
                     onChange={e => setForm({ ...form, director: e.target.value })} />
              <input className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-300" placeholder="Contact Email" value={form.email}
                     onChange={e => setForm({ ...form, email: e.target.value })} />
              <input className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-300" placeholder="Contact Phone" value={form.phone}
                     onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-300" type="number" placeholder="Geofence (meters)" value={form.geofence}
                     onChange={e => setForm({ ...form, geofence: e.target.value })} min="50" />
            </div>
            <div className="flex gap-2 mt-2">
              <input className="border rounded-lg p-3 flex-1" placeholder="Latitude" value={form.lat} readOnly />
              <input className="border rounded-lg p-3 flex-1" placeholder="Longitude" value={form.lng} readOnly />
              <button type="button" className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow" onClick={handleGeocode} disabled={locating}>
                {locating ? "Locating…" : "📍 Auto-Locate"}
              </button>
            </div>
            {form.lat && form.lng && (
              <div className="mt-4">
                <MapWidget lat={form.lat} lng={form.lng} label={form.name} />
              </div>
            )}
            <div className="flex justify-end">
              <button className="bg-gradient-to-tr from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white px-8 py-3 rounded-lg shadow font-bold text-lg transition">
                Save Course
              </button>
            </div>
          </form>
        )}

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-100/70 text-blue-900 text-left uppercase text-xs tracking-widest">
                <th className="p-4 border-b font-semibold">Name</th>
                <th className="p-4 border-b font-semibold">City</th>
                <th className="p-4 border-b font-semibold">State</th>
                <th className="p-4 border-b font-semibold">Head Pro</th>
                <th className="p-4 border-b font-semibold">Director</th>
                <th className="p-4 border-b font-semibold">Phone</th>
                <th className="p-4 border-b font-semibold">Email</th>
                <th className="p-4 border-b font-semibold">Map</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 && (
                <tr>
                  <td className="p-12 text-center text-gray-500" colSpan="8">
                    <div className="font-semibold text-lg mb-2">No courses yet</div>
                    <div className="mb-4">Click <span className="font-bold">“Add Course”</span> to create your first course.</div>
                  </td>
                </tr>
              )}
              {courses.map(c => (
                <tr key={c.id} className="odd:bg-white even:bg-blue-50/50 hover:bg-blue-100/60 transition">
                  <td className="p-4 border-b font-bold">{c.name}</td>
                  <td className="p-4 border-b">{c.city}</td>
                  <td className="p-4 border-b">{c.state}</td>
                  <td className="p-4 border-b flex items-center gap-2">
                    <FiUser className="text-gray-400" /> {c.headPro || "—"}
                  </td>
                  <td className="p-4 border-b flex items-center gap-2">
                    <FiUser className="text-gray-400" /> {c.director || "—"}
                  </td>
                  <td className="p-4 border-b flex items-center gap-2">
                    <FiPhone className="text-gray-400" /> {c.phone || "—"}
                  </td>
                  <td className="p-4 border-b flex items-center gap-2">
                    <FiMail className="text-gray-400" /> {c.email || "—"}
                  </td>
                  <td className="p-4 border-b">
                    {(c.lat && c.lng) ? (
                      <button
                        onClick={() => setSelected(c)}
                        className="text-blue-700 underline hover:text-blue-900 font-semibold"
                      >
                        View Map
                      </button>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Map Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">Map</h3>
          {selected ? (
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
              <div className="font-bold mb-2">{selected.name}</div>
              <MapWidget lat={selected.lat} lng={selected.lng} label={selected.name} />
              <div className="mt-2 text-sm text-gray-500">
                {selected.city}, {selected.state}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Select “View Map” to show a course on the map.</div>
          )}
        </div>
      </main>
    </div>
  );
}
