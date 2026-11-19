import { ORDEM, PERFIS } from "../data/perfis.js";

/** Gráfico radar dos quatro perfis (Águia no topo, Gato à direita, Tubarão embaixo, Lobo à esquerda). */
export default function Radar({ pct }) {
  const c = 150, R = 96, ang = [-90, 0, 90, 180].map((a) => (a * Math.PI) / 180);
  const max = Math.max(40, Math.ceil(Math.max(...ORDEM.map((x) => pct[x])) / 10) * 10);
  const pt = (i, r) => [c + Math.cos(ang[i]) * r, c + Math.sin(ang[i]) * r];
  const anel = (f) => ORDEM.map((_, i) => pt(i, R * f).join(",")).join(" ");
  const val = (x) => Math.max(6, (R * pct[x]) / max);
  const dados = ORDEM.map((x, i) => pt(i, val(x)).join(",")).join(" ");
  const lbl = [[c, 30, "middle"], [c + R + 12, c + 5, "start"], [c, c + R + 30, "middle"], [c - R - 12, c + 5, "end"]];

  return (
    <svg className="radar" viewBox="-30 0 360 300" role="img"
      aria-label={"Gráfico radar: " + ORDEM.map((x) => `${PERFIS[x].nome} ${pct[x]}%`).join(", ")}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={anel(f)} fill={f === 1 ? "rgba(245,236,212,.04)" : "none"} stroke="rgba(249,232,185,.16)" />
      ))}
      {ORDEM.map((_, i) => (
        <line key={i} x1={c} y1={c} x2={pt(i, R)[0]} y2={pt(i, R)[1]} stroke="rgba(249,232,185,.14)" />
      ))}
      <g className="poly">
        <polygon points={dados} fill="rgba(231,197,100,.28)" stroke="#e7c564" strokeWidth="2" strokeLinejoin="round" />
        {ORDEM.map((x, i) => {
          const p = pt(i, val(x));
          return <circle key={x} cx={p[0]} cy={p[1]} r="5" fill={PERFIS[x].hex} stroke="#fffbe9" strokeWidth="1.5" />;
        })}
      </g>
      {ORDEM.map((x, i) => (
        <text key={x} x={lbl[i][0]} y={lbl[i][1]} textAnchor={lbl[i][2]} fontFamily="Playfair Display" fontWeight="500" fontSize="15" fill="#f5ecd4">
          {PERFIS[x].nome}{" "}
          <tspan fontFamily="Jost" fontSize="12" fontWeight="600" fill="#f9e8b9">{pct[x]}%</tspan>
        </text>
      ))}
    </svg>
  );
}
