import { useEffect, useState } from "react";
import { newCourseTemplate } from "../utils/storage";
export default function CourseFormModal({ open, onClose, onSave, initial }) {
  const [form,setForm]=useState(newCourseTemplate());
  useEffect(()=>{ if(open) setForm(initial ?? newCourseTemplate()) },[open,initial]);
  if(!open) return null;
  const onChange=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));
  const submit=e=>{e.preventDefault(); if(!form.name.trim()) return; onSave(form);};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-lg font-semibold">{initial?"Edit Course":"Add Course"}</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-4 px-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="block text-sm text-gray-600 mb-1">Course Name</label>
              <input name="name" value={form.name} onChange={onChange} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring" placeholder="Wentworth" required/></div>
            <div><label className="block text-sm text-gray-600 mb-1">City</label>
              <input name="city" value={form.city} onChange={onChange} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring" placeholder="Tarpon Springs"/></div>
            <div><label className="block text-sm text-gray-600 mb-1">State</label>
              <input name="state" value={form.state} onChange={onChange} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring" placeholder="FL"/></div>
            <div><label className="block text-sm text-gray-600 mb-1"># Par-3 Holes</label>
              <input type="number" min="1" max="18" name="par3Holes" value={form.par3Holes} onChange={onChange} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"/></div>
            <div><label className="block text-sm text-gray-600 mb-1">Contact</label>
              <input name="contact" value={form.contact} onChange={onChange} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring" placeholder="Head Pro / GM"/></div>
            <div><label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={onChange} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring" placeholder="pro@course.com"/></div>
            <div className="sm:col-span-2"><label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring" placeholder="(555) 555-5555"/></div>
            <div className="sm:col-span-2"><label className="block text-sm text-gray-600 mb-1">Status</label>
              <select name="status" value={form.status} onChange={onChange} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring">
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select></div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
