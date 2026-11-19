import { createStore } from "./store.js";

/** Estado visual global: toast, modal, cena de fundo e o "pulo" do contador de luzes. */
export const ui = createStore({
  toast: null,
  modal: null,
  cena: { img: "img/capa.jpg", prof: 0 },
  bump: 0
});

export const reduz = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function haptic(p = 8) {
  try { navigator.vibrate && navigator.vibrate(p); } catch (e) { /* ignora */ }
}

let tToast;
export function toast(txt, icon = "spark") {
  ui.set({ toast: { txt, icon, on: true, id: Date.now() } });
  clearTimeout(tToast);
  tToast = setTimeout(() => ui.set((s) => ({ toast: s.toast && { ...s.toast, on: false } })), 2600);
}

export const fecharModal = () => ui.set({ modal: null });

/** Abre um modal. `render(close)` devolve o conteúdo. */
export function modal(render, { center = false } = {}) {
  ui.set({ modal: { render, center } });
  return fecharModal;
}

export function confirmar(titulo, texto, ok, okTxt = "Confirmar") {
  modal((close) => (
    <div className="sheet">
      <div className="grab" />
      <h3 className="display" style={{ fontSize: 28 }}>{titulo}</h3>
      <p className="sub" style={{ margin: "8px 0 20px" }}>{texto}</p>
      <div className="row">
        <button className="btn line" onClick={close}>Cancelar</button>
        <button className="btn plum" id="mok" onClick={() => { close(); ok(); }}>{okTxt}</button>
      </div>
    </div>
  ));
}

/** Troca a arte desfocada do fundo e a profundidade do mar (0 = superfície, 1 = fundo). */
export function cena(img, prof = 0) {
  const c = ui.get().cena;
  if (c.img !== img || c.prof !== prof) ui.set({ cena: { img, prof } });
}

/* ---------------- efeitos (partículas no #fx) ---------------- */
const fx = () => document.getElementById("fx");

export function bolhas(n = 8) {
  const box = fx();
  if (reduz || !box) return;
  for (let i = 0; i < n; i++) {
    const b = document.createElement("div");
    b.className = "bub";
    const s = 4 + Math.random() * 12;
    b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;--dx:${(Math.random() - 0.5) * 80}px;animation-duration:${4 + Math.random() * 4}s;animation-delay:${Math.random()}s`;
    box.appendChild(b);
    setTimeout(() => b.remove(), 9500);
  }
}

export function explosao(n = 46) {
  const box = fx();
  if (reduz || !box) return;
  const r = box.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 190, z = 4 + Math.random() * 8;
    s.style.cssText = `left:${r.width / 2}px;top:${r.height * 0.42}px;width:${z}px;height:${z}px;--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d + 60}px;animation-delay:${Math.random() * 0.15}s`;
    box.appendChild(s);
    setTimeout(() => s.remove(), 1800);
  }
}
