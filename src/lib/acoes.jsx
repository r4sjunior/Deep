import { S, commit } from "./store.js";
import { ui, modal, haptic, explosao, bolhas } from "./ui.jsx";
import { aba, ir, definir } from "./nav.js";
import { faseFeita, faseDe, perfil, testeOk, palavras, nomesTop } from "./regras.js";
import { EX, FASES, CONTATO } from "../data/jornada.jsx";
import { ORDEM, PERFIS } from "../data/perfis.js";

/** Acende luzes de consciência (a pontuação do game). */
export function luz(n = 1) {
  S.luzes += n;
  commit();
  ui.set((s) => ({ bump: s.bump + 1 }));
}

function celebrar(f) {
  haptic([20, 40, 20]);
  explosao();
  bolhas(20);
  const i = FASES.indexOf(f), prox = FASES[i + 1];
  modal((close) => (
    <div className="celebrate">
      <div className="badge"><b>{f.letra}</b></div>
      <div className="eyebrow">Fase {i + 1} concluída · +5 luzes</div>
      <h2 className="display" style={{ margin: "8px 0 10px" }}>{f.nome}</h2>
      <p className="sub" style={{ marginBottom: 22 }}>
        {prox ? (
          <>Você desbloqueou a fase <b style={{ color: "var(--gold-2)" }}>{prox.nome}</b>. Mergulhe mais fundo quando se sentir pronto(a).</>
        ) : (
          "Você completou o Método DEEP. Volte a estas páginas sempre que precisar se reencontrar."
        )}
      </p>
      <button className="btn gold block" id="cg" onClick={() => { close(); aba(prox ? "jornada" : "ita"); }}>
        {prox ? "Continuar o mergulho" : "Conhecer o Diagnóstico da Alma"}
      </button>
    </div>
  ), { center: true });
}

export function checarFase(f) {
  if (faseFeita(f) && !S.fases[f.id]) {
    S.fases[f.id] = true;
    luz(5);
    setTimeout(() => celebrar(f), 450);
  }
}

export function abrirPasso(f, j) {
  const p = f.passos[j];
  if (p.t === "ex") ir("ex", { f: f.id, k: p.k });
  else if (p.t === "teste") ir("testeIntro", f.id);
  else ir("ler", { f: f.id, k: p.k });
}

/** Marca o passo e volta para a tela da fase. */
export function concluirPasso(fid, k) {
  if (k && !S.feito[k]) { S.feito[k] = true; commit(); }
  definir([{ rota: "aba", arg: "jornada" }, { rota: "fase", arg: fid }], "pop");
  checarFase(faseDe(fid));
}

export const linkWhats = (texto) =>
  `https://wa.me/${CONTATO.whats}${texto ? "?text=" + encodeURIComponent(texto) : ""}`;

/** Gera o PDF pelo diálogo de impressão do navegador. */
export function imprimir() {
  const box = document.getElementById("print");
  box.innerHTML = "";
  const el = (tag, txt, cls) => {
    const e = document.createElement(tag);
    e.textContent = txt;
    if (cls) e.className = cls;
    box.appendChild(e);
  };
  el("h1", "DEEP — Meu mergulho");
  el("p", (S.nome ? S.nome + " · " : "") + new Date().toLocaleDateString("pt-BR"));
  if (testeOk()) {
    const { pct, top } = perfil();
    el("h2", "Perfil comportamental — predominante: " + nomesTop(top));
    ORDEM.forEach((k) => el("p", `${PERFIS[k].nome}: ${pct[k]}%`));
  }
  Object.entries(EX).forEach(([id, e]) => {
    const t = S.textos[id];
    if (!t) return;
    const itens = e.campos.filter(([c]) => palavras(t[c]));
    if (!itens.length) return;
    el("h2", `Exercício ${e.n} — ${e.titulo}`);
    itens.forEach(([c, l]) => { el("div", l, "q"); el("div", t[c], "a"); });
  });
  el("p", `Ita Batista · @${CONTATO.insta} · ${CONTATO.whatsLabel}`);
  window.print();
}
