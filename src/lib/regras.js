import { S } from "./store.js";
import { ORDEM, PERFIS } from "../data/perfis.js";
import { PERGUNTAS } from "../data/perguntas.js";
import { EX, FASES, LEITURAS } from "../data/jornada.jsx";

/** Regra do livro: total de cada letra × 4. Empate mostra os perfis empatados. */
export function perfil() {
  const c = { I: 0, C: 0, A: 0, O: 0 };
  S.respostas.forEach((r, i) => { if (r != null) c[PERGUNTAS[i][1][r][0]]++; });
  const pct = {};
  ORDEM.forEach((k) => (pct[k] = c[k] * 4));
  const max = Math.max(...ORDEM.map((k) => pct[k]));
  return { pct, top: ORDEM.filter((k) => pct[k] === max) };
}
export const nomesTop = (top) => top.map((k) => PERFIS[k].nome).join(" + ");

export const testeOk = () => S.respostas.every((r) => r != null);
export const respondidas = () => S.respostas.filter((r) => r != null).length;
export const passoFeito = (p) => (p.t === "teste" ? testeOk() : !!S.feito[p.k]);
export const faseFeita = (f) => f.passos.every(passoFeito);
export const faseLivre = (i) => i === 0 || faseFeita(FASES[i - 1]);
export const passoLivre = (f, j) => faseLivre(FASES.indexOf(f)) && (j === 0 || passoFeito(f.passos[j - 1]));
export const faseDe = (id) => FASES.find((x) => x.id === id);

export function infoPasso(p) {
  if (p.t === "ex") {
    const e = EX[p.k];
    return { titulo: e.titulo, img: e.img, tipo: `Exercício ${e.n} · escrita`, min: e.min, icone: "pen" };
  }
  if (p.t === "teste") return { titulo: "Águia, Gato, Tubarão ou Lobo?", img: "img/ex2.jpg", tipo: "Exercício 2 · teste", min: 5, icone: "q" };
  const l = LEITURAS[p.k];
  return { titulo: l.titulo, img: l.img, tipo: "Leitura", min: l.min, icone: "read" };
}

export function proximoPasso() {
  for (const f of FASES) {
    const j = f.passos.findIndex((p) => !passoFeito(p));
    if (j >= 0) return { f, j, p: f.passos[j] };
  }
  return null;
}

export const palavras = (t) => (t || "").trim().split(/\s+/).filter(Boolean).length;
export const escreveuEm = (k) => Object.values(S.textos[k] || {}).some((t) => palavras(t) > 0);
export const totalPalavras = () =>
  Object.values(S.textos).reduce((a, o) => a + Object.values(o).reduce((b, t) => b + palavras(t), 0), 0);
export const exEscritos = () => Object.keys(EX).filter(escreveuEm).length;

export function saudacao() {
  const h = new Date().getHours();
  return h < 5 ? "Boa noite" : h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}
