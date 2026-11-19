import { createStore } from "./store.js";
import { ui, fecharModal } from "./ui.jsx";

/**
 * Navegação de app: uma pilha de telas integrada ao botão "voltar" do aparelho.
 * Rotas: splash, onb, aba(jornada|perfil|diario|ita), fase, ex, ler, testeIntro, quiz, busca, revela.
 */
export const nav = createStore({ pilha: [{ rota: "splash" }], anim: "fade", key: 0 });

const mudar = (pilha, anim) => nav.set((s) => ({ pilha, anim, key: s.key + 1 }));
const push = (n) => { try { history.pushState({ n }, ""); } catch (e) { /* ignora */ } };

export function ir(rota, arg, anim = "push") {
  const pilha = [...nav.get().pilha, { rota, arg }];
  push(pilha.length);
  mudar(pilha, anim);
}

export function trocar(rota, arg, anim = "fade") {
  const pilha = [...nav.get().pilha];
  pilha[pilha.length - 1] = { rota, arg };
  mudar(pilha, anim);
}

export const aba = (a, anim = "fade") => mudar([{ rota: "aba", arg: a }], anim);

/** Define a pilha inteira (ex.: abrir um passo a partir do Diário). */
export const definir = (pilha, anim = "push") => mudar(pilha, anim);

export function voltar() {
  const { pilha } = nav.get();
  if (pilha.length <= 1) { aba("jornada"); return; }
  mudar(pilha.slice(0, -1), "pop");
}

export function voltarHist() {
  if (history.state && history.state.n > 0) history.back();
  else voltar();
}

export function iniciarHistorico() {
  try { history.replaceState({ n: 0 }, ""); } catch (e) { /* ignora */ }
  addEventListener("popstate", () => {
    if (ui.get().modal) { fecharModal(); return; }
    if (nav.get().pilha.length > 1) voltar();
  });
}
