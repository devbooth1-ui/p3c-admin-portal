import React, { useEffect, useMemo, useState } from "react";
function cents(n){ return (n/100).toFixed(2); }
const initialMarketing = 0;
const initialOtherRevenue = 0;
export default function Accounting(){
  const [rows, setRows] = useState([]);
  const [marketing, setMarketing] = useState(initialMarketing);
  const [otherRevenue, setOtherRevenue] = useState(initialOtherRevenue);
  useEffect(() => {
    // In real app, fetch from backend
    const saved = localStorage.getItem("par3-transactions");
    if (saved) setRows(JSON.parse(saved));
    else setRows([]);
    const m = localStorage.getItem("par3-marketing");
    if (m) setMarketing(Number(m));
    const o = localStorage.getItem("par3-other-revenue");
    if (o) setOtherRevenue(Number(o));
  }, []);
  useEffect(() => { localStorage.setItem("par3-marketing", marketing); }, [marketing]);
  useEffect(() => { localStorage.setItem("par3-other-revenue", otherRevenue); }, [otherRevenue]);
  const totals = useMemo(() => {
    const birdie = rows.filter(r=>r.type==="birdie").reduce((s,r)=>s+r.amountCents,0);
    const hio = rows.filter(r=>r.type==="hole-in-one").reduce((s,r)=>s+r.amountCents,0);
    const payouts = rows.filter(r=>r.type==="birdie"||r.type==="hole-in-one").reduce((s,r)=>s+r.amountCents,0);
    const entries = rows.filter(r=>r.type==="entry").reduce((s,r)=>s+r.amountCents,0);
    return {
      entries,
      payouts,
      net: entries + otherRevenue - Math.abs(payouts) - marketing,
      birdie,
      hio,
      birdieCount: rows.filter(r=>r.type==="birdie").length,
      hioCount: rows.filter(r=>r.type==="hole-in-one").length
    };
  }, [rows, marketing, otherRevenue]);
  function exportCSV(){
    const header = ["Date","Player/Desc","Course","Type","Amount"];
    const lines = rows.map(r => [
      new Date(r.dateISO).toLocaleString(), r.player, r.course, r.type, (r.amountCents/100).toFixed(2)
    ]);
    const csv = [header, ...lines].map(a=>a.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "par3-accounting.csv"; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="max-w-4xl space-y-4">
      <h2 className="text-2xl font-bold">Accounting</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Entries Revenue</div><div className="text-2xl font-bold">${cents(totals.entries)}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Other Revenue</div><div className="text-2xl font-bold">${cents(otherRevenue)}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Marketing Costs</div><div className="text-2xl font-bold">${cents(marketing)}</div></div>
        <div className={`bg-white p-4 rounded shadow ${totals.net>=0?"":"text-red-600"}`}><div className="text-sm text-gray-500">Net</div><div className="text-2xl font-bold">${cents(totals.net)}</div></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Birdie Payouts</div><div className="text-2xl font-bold">${cents(Math.abs(totals.birdie))} ({totals.birdieCount})</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Hole-in-One Payouts</div><div className="text-2xl font-bold">${cents(Math.abs(totals.hio))} ({totals.hioCount})</div></div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-500">Marketing Costs</label>
          <input type="number" className="border p-2 w-full" value={marketing} onChange={e=>setMarketing(Number(e.target.value)||0)} min="0" />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-500">Other Revenue</label>
          <input type="number" className="border p-2 w-full" value={otherRevenue} onChange={e=>setOtherRevenue(Number(e.target.value)||0)} min="0" />
        </div>
      </div>
      <div className="flex justify-end"><button onClick={exportCSV} className="bg-blue-600 text-white px-4 py-2 rounded">Export CSV</button></div>
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead><tr className="bg-gray-100 text-left"><th className="p-2 border">Date</th><th className="p-2 border">Player/Desc</th><th className="p-2 border">Course</th><th className="p-2 border">Type</th><th className="p-2 border">Amount</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{new Date(r.dateISO).toLocaleString()}</td>
              <td className="p-2 border">{r.player}</td>
              <td className="p-2 border">{r.course}</td>
              <td className="p-2 border capitalize">{r.type}</td>
              <td className={`p-2 border ${r.amountCents<0?"text-red-600":""}`}>${cents(r.amountCents)}</td>
            </tr>
          ))}
          {rows.length===0 && (<tr><td className="p-4 text-center text-gray-500" colSpan="5">No transactions.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
