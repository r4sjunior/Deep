import { useSyncExternalStore } from "react";

/** Mini store reativo: get/set/subscribe + hook. */
export function createStore(inicial) {
  let estado = inicial;
  const subs = new Set();
  return {
    get: () => estado,
    set(parcial) {
      estado = { ...estado, ...(typeof parcial === "function" ? parcial(estado) : parcial) };
      subs.forEach((f) => f());
    },
    subscribe(f) {
      subs.add(f);
      return () => subs.delete(f);
    },
    use() {
      return useSyncExternalStore(this.subscribe, this.get);
    }
  };
}

/* ------------- progresso da pessoa (salvo no aparelho) ------------- */
const KEY = "deep-ita-batista-v2";

export const novo = () => ({
  nome: "",
  respostas: Array(25).fill(null),
  textos: {},
  feito: {},
  fases: {},
  luzes: 0,
  inicio: false,
  vistoPerfil: false,
  carta: null,
  medalhas: []
});

function carregar() {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return Object.assign(novo(), JSON.parse(r));
  } catch (e) { /* armazenamento indisponível */ }
  return novo();
}

/** Estado vivo. As telas leem `S` e chamam `commit()` depois de mudar. */
export let S = carregar();

let versao = 0;
const subs = new Set();
const subscribe = (f) => (subs.add(f), () => subs.delete(f));

/** Salva sem redesenhar (ex.: enquanto a pessoa digita). */
export function persistir() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignora */ }
}

/** Salva e redesenha quem usa `useApp()`. */
export function commit() {
  persistir();
  versao++;
  subs.forEach((f) => f());
}

export function resetar() {
  S = novo();
  commit();
}

export function useApp() {
  useSyncExternalStore(subscribe, () => versao);
  return S;
}
