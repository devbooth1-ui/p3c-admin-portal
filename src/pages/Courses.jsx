import { useState, useMemo } from "react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", city:"", state:"", par3Holes:1, contact:"" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(c =>
      [c.name, c.city, c.state, c.contact].some(v => (v||"").toLowerCase().includes(q))
    );
  }, [courses, query]);

  function saveCourse(e){ 
    e.preventDefault();
    if(!form.name.trim()) return;
    setCourses(prev => [{...form}, ...prev]);
    setForm({ name:"", city:"", state:"", par3Holes:1, contact:"" });
    setShowForm(false);
  }

  return (
    <section className="space-y-4" style={{padding:24}}>
      <div style={{display:"flex", gap:12, alignItems:"center", justifyContent:"space-between", flexWrap:"wrap"}}>
        <h2 style={{fontSize:24, fontWeight:700}}>Courses</h2>
        <div style={{display:"flex", gap:8}}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses…"
            style={{width:260, padding:"8px 12px", borderRadius:12, border:"1px solid #ddd", outline:"none"}}
          />
          <button
            onClick={() => setShowForm(true)}
            style={{borderRadius:12, background:"#111", color:"#fff", padding:"8px 14px", fontSize:14}}
          >
            + Add Course
          </button>
        </div>
      </div>

      <div style={{overflow:"hidden", border:"1px solid #eee", borderRadius:16, background:"#fff"}}>
        <table style={{width:"100%", fontSize:14, borderCollapse:"collapse"}}>
          <thead style={{background:"#f7f7f7"}}>
            <tr>
              <th style={{textAlign:"left", padding:"10px 16px"}}>Course</th>
              <th style={{textAlign:"left", padding:"10px 16px"}}>Location</th>
              <th style={{textAlign:"left", padding:"10px 16px"}}>Par-3 Holes</th>
              <th style={{textAlign:"left", padding:"10px 16px"}}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{padding:"24px 16px", textAlign:"center", color:"#666"}}>
                  No courses yet. Click “+ Add Course”.
                </td>
              </tr>
            )}
            {filtered.map((c, i) => (
              <tr key={i} style={{borderTop:"1px solid #eee"}}>
                <td style={{padding:"10px 16px", fontWeight:600}}>{c.name}</td>
                <td style={{padding:"10px 16px"}}>{[c.city, c.state].filter(Boolean).join(", ")}</td>
                <td style={{padding:"10px 16px"}}>{c.par3Holes}</td>
                <td style={{padding:"10px 16px"}}>{c.contact || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.3)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:16, zIndex:50
        }}>
          <div style={{width:"100%", maxWidth:600, border:"1px solid #eee", background:"#fff", borderRadius:16, boxShadow:"0 10px 30px rgba(0,0,0,.08)"}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderBottom:"1px solid #eee"}}>
              <h3 style={{fontSize:18, fontWeight:600}}>Add Course</h3>
              <button onClick={()=>setShowForm(false)} style={{border:"none", background:"transparent", padding:"6px 8px"}}>✕</button>
            </div>
            <form onSubmit={saveCourse} style={{padding:16, display:"grid", gap:12}}>
              <input placeholder="Course name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}
                     required style={{padding:"8px 12px", border:"1px solid #ddd", borderRadius:12}}/>
              <div style={{display:"grid", gap:12, gridTemplateColumns:"1fr 1fr"}}>
                <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})}
                       style={{padding:"8px 12px", border:"1px solid #ddd", borderRadius:12}}/>
                <input placeholder="State" value={form.state} onChange={e=>setForm({...form, state:e.target.value})}
                       style={{padding:"8px 12px", border:"1px solid #ddd", borderRadius:12}}/>
              </div>
              <input type="number" min="1" max="18" placeholder="# Par-3 Holes"
                     value={form.par3Holes} onChange={e=>setForm({...form, par3Holes:Number(e.target.value)})}
                     style={{padding:"8px 12px", border:"1px solid #ddd", borderRadius:12}}/>
              <input placeholder="Contact" value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})}
                     style={{padding:"8px 12px", border:"1px solid #ddd", borderRadius:12}}/>
              <div style={{display:"flex", justifyContent:"flex-end", gap:8, marginTop:4}}>
                <button type="button" onClick={()=>setShowForm(false)}
                        style={{padding:"8px 12px", border:"1px solid #ddd", borderRadius:12, background:"#fff"}}>Cancel</button>
                <button type="submit"
                        style={{padding:"8px 12px", borderRadius:12, background:"#111", color:"#fff"}}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
