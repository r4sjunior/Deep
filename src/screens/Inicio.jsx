import { useEffect, useRef, useState } from "react";
import { S, commit } from "../lib/store.js";
import { cena, haptic, bolhas, toast, reduz } from "../lib/ui.jsx";
import { aba, trocar } from "../lib/nav.js";
import { FASES } from "../data/jornada.jsx";

export function Splash() {
  const feito = useRef(false);
  const seguir = () => {
    if (feito.current) return;
    feito.current = true;
    if (S.inicio) aba("jornada");
    else trocar("onb");
  };
  useEffect(() => {
    cena("img/capa.jpg", 0);
    const t = setTimeout(seguir, 2400);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="splash anim-fade" onClick={seguir}>
      <div>
        <div className="rings"><i /><i /><i /><img src="img/logo.png" alt="" /></div>
        <div className="word display">{"DEEP".split("").map((l, i) => <span key={i}>{l}</span>)}</div>
        <div className="sign">Ita Batista</div>
      </div>
    </div>
  );
}

export function Onboarding() {
  const sl = useRef(null);
  const [idx, setIdx] = useState(0);
  const [nome, setNome] = useState(S.nome);

  useEffect(() => { cena("img/capa.jpg", 0.1); }, []);

  const onScroll = () => requestAnimationFrame(() => {
    const el = sl.current;
    if (el) setIdx(Math.round(el.scrollLeft / el.clientWidth));
  });

  const avancar = () => {
    haptic();
    const el = sl.current;
    if (idx < 2) {
      el.scrollTo({ left: el.clientWidth * (idx + 1), behavior: reduz ? "auto" : "smooth" });
      return;
    }
    S.nome = nome.trim();
    S.inicio = true;
    commit();
    bolhas(16);
    aba("jornada");
    setTimeout(() => toast(`Seja muito bem-vindo(a)${S.nome ? ", " + S.nome : ""}!`, "heart"), 400);
  };

  return (
    <div className="onb anim-fade">
      <div className="slides" ref={sl} onScroll={onScroll}>
        <section className="slide">
          <div className="art">
            <img src="img/capa.jpg" alt="Mulher tocando a água de um lago, com uma luz dourada sob a superfície" />
            <div className="plate"><b>DEEP</b><small>Um mergulho no autoconhecimento e na sua verdade</small></div>
          </div>
          <h2 className="display">Um material para ser vivido</h2>
          <p className="sub">Criado por Ita Batista a partir do Método DEEP, para conduzir você a um mergulho mais profundo em si — respeitando seu tempo, sua história e seu processo.</p>
        </section>
        <section className="slide txt">
          <div className="eyebrow" style={{ marginTop: 12 }}>Como funciona</div>
          <h2 className="display" style={{ marginTop: 8 }}>Quatro fases, um game</h2>
          <p className="sub">Como num jogo de tabuleiro ou um game no computador: cada fase desbloqueia a próxima, e a cada passo você acende luzes de consciência.</p>
          <div className="deep-list">
            {FASES.map((f) => (
              <div key={f.id}><b>{f.letra}</b><p><strong>{f.nome}</strong><span>{f.resumo}</span></p></div>
            ))}
          </div>
        </section>
        <section className="slide txt">
          <div className="eyebrow" style={{ marginTop: 12 }}>Antes de começar</div>
          <h2 className="display" style={{ marginTop: 8 }}>Um combinado com você</h2>
          <div className="quote" style={{ margin: "14px 0 16px" }}>Que você se permita viver esta jornada despindo-se de julgamentos e críticas — somente mergulhando. Pode ser?</div>
          <p className="sub">Aqui não existe certo ou errado. Suas respostas ficam guardadas só neste aparelho.</p>
          <label className="field">
            <span>Como você quer ser chamado(a)?</span>
            <input className="input" id="nm" maxLength={40} placeholder="Seu nome" autoComplete="given-name"
              value={nome} onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") avancar(); }} />
          </label>
        </section>
      </div>
      <div className="dots">{[0, 1, 2].map((i) => <i key={i} className={i === idx ? "on" : ""} />)}</div>
      <div className="foot">
        <button className="btn gold block" id="nx" onClick={avancar}>{idx === 2 ? "Combinado!" : "Continuar"}</button>
      </div>
    </div>
  );
}
