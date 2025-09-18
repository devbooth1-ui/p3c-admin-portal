import React, { useEffect, useMemo, useState } from "react";
const seed = [
  { id: 1, dateISO: new Date().toISOString(), player: "Jane Golfer", course: "Riverside Par 3", amountCents: 2500, type: "entry" },
  { id: 2, dateISO: new Date().toISOString(), player: "Prize Payout", course: "Riverside Par 3", amountCents: -6500, type: "payout" }
];
function cents(n){ return (n/100).toFixed(2); }
export default function Accounting(){
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("par3-transactions");
    if (saved) setRows(JSON.parse(saved));
    else { setRows(seed); localStorage.setItem("par3-transactions", JSON.stringify(seed)); }
  }, []);
  const totals = useMemo(() => {
    const revenue = rows.filter(r=>r.type==="entry").reduce((s,r)=>s+r.amountCents,0);
    const payouts = rows.filter(r=>r.type==="payout").reduce((s,r)=>s+r.amountCents,0);
    return { revenue, payouts, net: revenue + payouts };
  }, [rows]);
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
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Revenue</div><div className="text-2xl font-bold">${cents(totals.revenue)}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Payouts</div><div className="text-2xl font-bold">${cents(Math.abs(totals.payouts))}</div></div>
        <div className={`bg-white p-4 rounded shadow ${totals.net>=0?"":"text-red-600"}`}><div className="text-sm text-gray-500">Net</div><div className="text-2xl font-bold">${cents(totals.net)}</div></div>
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
