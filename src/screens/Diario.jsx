import { useEffect } from "react";
import Icon from "../components/Icon.jsx";
import { Page, Topo } from "../components/Chrome.jsx";
import { useApp } from "../lib/store.js";
import { cena, haptic, toast } from "../lib/ui.jsx";
import { definir } from "../lib/nav.js";
import { abrirPasso, imprimir } from "../lib/acoes.jsx";
import {
  infoPasso, passoFeito, passoLivre, perfil, respondidas, testeOk, palavras, exEscritos, totalPalavras, nomesTop
} from "../lib/regras.js";
import { EX, FASES } from "../data/jornada.jsx";

const ordem = (p) => (p.t === "teste" ? 2 : EX[p.k].n);
const ITENS = FASES.flatMap((f) => f.passos.map((p, j) => ({ f, j, p })))
  .filter(({ p }) => p.t !== "ler")
  .sort((a, b) => ordem(a.p) - ordem(b.p));

export default function Diario({ anim }) {
  const S = useApp();
  useEffect(() => { cena("img/ex3.jpg", 0.3); }, []);

  const resumo = (f, p, livre) => {
    if (p.t === "teste") {
      if (!testeOk()) return `${respondidas()} de 25 respondidas`;
      const r = perfil();
      return `Perfil predominante: ${nomesTop(r.top)} · ${r.pct[r.top[0]]}%`;
    }
    const t = Object.values(S.textos[p.k] || {}).find((v) => palavras(v) > 0);
    if (t) return `“${t.trim()}”`;
    return livre ? "Ainda em branco — toque para escrever." : `Disponível na fase ${f.nome}.`;
  };

  const abrir = (f, j, livre) => {
    if (!livre) { haptic(30); toast(`Disponível na fase ${f.nome}`, "lock"); return; }
    haptic();
    definir([{ rota: "aba", arg: "diario" }, { rota: "fase", arg: f.id }]);
    abrirPasso(f, j);
  };

  return (
    <Page anim={anim}>
      <Topo back={false} titulo="Diário" />
      <div className="stagger">
        <div className="hello">
          <div className="eyebrow">Minhas percepções</div>
          <h1 className="display">Seu diário DEEP</h1>
          <p className="sub" style={{ marginTop: 8 }}>Este não é um conteúdo para ser apenas lido. É um material para ser vivido — e, em muitos momentos, revisitado.</p>
        </div>
        <div className="stats">
          <div><b>{exEscritos()}<small style={{ fontSize: 16, color: "var(--soft)" }}>/6</small></b><span>exercícios escritos</span></div>
          <div><b>{totalPalavras()}</b><span>palavras</span></div>
          <div><b>{S.luzes}</b><span>luzes acesas</span></div>
        </div>
        <div className="sec"><h3>Exercícios</h3><span>toque para abrir</span></div>
        <div>
          {ITENS.map(({ f, j, p }) => {
            const inf = infoPasso(p), livre = passoLivre(f, j) || passoFeito(p);
            return (
              <button key={p.k} className={"entry" + (livre ? "" : " lock")} onClick={() => abrir(f, j, livre)}>
                <img src={inf.img} alt="" />
                <div className="tx">
                  <div className="eyebrow" style={{ fontSize: 10 }}>{inf.tipo}</div>
                  <strong>{inf.titulo}</strong>
                  <p>{resumo(f, p, livre)}</p>
                </div>
                <Icon n={livre ? (passoFeito(p) ? "check" : "chev") : "lock"} />
              </button>
            );
          })}
        </div>
        <button className="btn line block" id="pdf" style={{ marginTop: 8 }} onClick={imprimir}><Icon n="down" /> Salvar meu diário em PDF</button>
      </div>
    </Page>
  );
}
