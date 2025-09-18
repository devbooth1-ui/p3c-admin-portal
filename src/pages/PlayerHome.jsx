import React, { useEffect, useState } from "react";

function haversine(lat1, lng1, lat2, lng2) {
  const toRad = d => d * Math.PI / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export default function PlayerHome() {
  const [location, setLocation] = useState(null);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => setError(err.message),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        const found = data.find(c => {
          const dist = haversine(location.lat, location.lng, Number(c.lat), Number(c.lng));
          return dist <= (c.geofence || 200);
        });
        setCourse(found || null);
      } catch (e) {
        setError("Could not load courses");
      }
    }
    fetchCourses();
  }, [location]);

  return (
    <div style={{padding:24}}>
      <h1>Home</h1>
      {error && <div style={{color:'red'}}>{error}</div>}
      {!location && !error && <div>Detecting your location…</div>}
      {location && !course && <div>No participating course found at your location.</div>}
      {course && (
        <div style={{marginTop:16, padding:16, background:'#f8f8f8', borderRadius:8}}>
          <h2 style={{marginBottom:8}}>{course.name}</h2>
          <div><b>Hole:</b> {course.hole || 1}</div>
          <div><b>Yardage:</b> {course.yardage || 'N/A'}</div>
        </div>
      )}
    </div>
  );
}
