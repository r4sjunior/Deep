import { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";
import { useApp, S } from "../lib/store.js";
import { ui, haptic } from "../lib/ui.jsx";
import { aba, voltarHist } from "../lib/nav.js";
import { testeOk } from "../lib/regras.js";

/** Contador de "luzes de consciência", com um pulo a cada ponto ganho. */
export function Luz() {
  const app = useApp();
  const { bump } = ui.use();
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !bump) return;
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }, [bump]);
  return (
    <span className="luz" ref={ref} title="Luzes de consciência">
      <span className="orb" />
      <b>{app.luzes}</b>
    </span>
  );
}

/** Barra superior: fica sólida quando a tela rola. */
export function Topo({ back = true, titulo = "" }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const v = document.getElementById("view");
    if (!v) return;
    const on = () => setSolid(v.scrollTop > 30);
    v.addEventListener("scroll", on, { passive: true });
    return () => v.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={"top" + (solid ? " solid" : "")}>
      {back ? (
        <button className="ib" aria-label="Voltar" onClick={() => { haptic(); voltarHist(); }}><Icon n="back" /></button>
      ) : (
        <span className="spacer" />
      )}
      <div className="ttl">{titulo}</div>
      <Luz />
    </header>
  );
}

const ABAS = [["jornada", "compass", "Jornada"], ["perfil", "user", "Perfil"], ["diario", "book", "Diário"], ["ita", "heart", "Ita"]];

export function Tabs({ ativa }) {
  useApp();
  const novoPerfil = testeOk() && !S.vistoPerfil;
  return (
    <nav id="tabs" className={ativa ? "" : "hide"} aria-label="Navegação principal">
      {ABAS.map(([k, i, l]) => (
        <button
          key={k}
          className={k === ativa ? "on" : ""}
          data-t={k}
          aria-label={l}
          aria-current={k === ativa ? "page" : undefined}
          onClick={() => { haptic(); aba(k); }}
        >
          <Icon n={i} />
          {l}
          {k === "perfil" && novoPerfil && ativa !== "perfil" && <span className="dot" />}
        </button>
      ))}
    </nav>
  );
}

/** Página com rolagem padrão (abas ou telas internas). */
export function Page({ anim = "fade", cls = "", children }) {
  return <div className={`page ${cls} anim-${anim}`}>{children}</div>;
}

export function Toast() {
  const { toast } = ui.use();
  return (
    <div id="toast" role="status" className={toast?.on ? "on" : ""}>
      {toast && (<><Icon n={toast.icon} /><span>{toast.txt}</span></>)}
    </div>
  );
}

export function Modal() {
  const { modal } = ui.use();
  const close = () => ui.set({ modal: null });
  return (
    <div
      id="modal"
      className={modal ? "on" + (modal.center ? " center" : "") : ""}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      {modal && modal.render(close)}
    </div>
  );
}

/** Painel lateral com a marca, visível só em telas largas. */
export function Side() {
  return (
    <aside id="side" aria-hidden="true">
      <img src="img/logo.png" alt="" style={{ width: 90 }} />
      <div className="display" style={{ fontSize: 52, letterSpacing: ".12em" }}>DEEP</div>
      <p>Um mergulho no autoconhecimento e na sua verdade, pelo Método DEEP: Despertar, Entender, Empoderar e Potencializar.</p>
      <div className="sign">Ita Batista</div>
    </aside>
  );
}
