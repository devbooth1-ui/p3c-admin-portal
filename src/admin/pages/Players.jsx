import React from "react";
import { players } from "../lib/data";
export default function Players(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      <ul className="space-y-2">
        {players.map(p => <li key={p.id} className="bg-white border rounded p-2">{p.name} — {p.score} — {p.reward}</li>)}
      </ul>
    </div>
  );
}
