import { useState } from "react";

export default function App() {
  const [xp] = useState(0);
  const [nivel] = useState(1);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>PomoFocos ⚔️</h1>
      <p>XP: {xp} · Nível: {nivel}</p>
      <p>Boilerplate inicial — conecte à API em http://localhost:3333</p>
    </main>
  );
}
