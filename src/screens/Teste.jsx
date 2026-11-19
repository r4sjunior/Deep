import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { Page, Topo } from "../components/Chrome.jsx";
import { useApp, S, commit } from "../lib/store.js";
import { cena, haptic, toast, bolhas, explosao } from "../lib/ui.jsx";
import { aba, ir, trocar, voltarHist } from "../lib/nav.js";
import { checarFase, luz, refazerTeste } from "../lib/acoes.jsx";
import { perfil, respondidas, testeOk, nomesTop } from "../lib/regras.js";
import { ORDEM, PERFIS } from "../data/perfis.js";
import { PERGUNTAS } from "../data/perguntas.js";
import { FASES } from "../data/jornada.jsx";

export function TesteIntro({ arg: fid, anim }) {
  useApp();
  const feitas = respondidas();
  useEffect(() => { cena("img/ex2.jpg", 0.15); }, []);
  const comecar = () => {
    haptic();
    ir("quiz", { f: fid, i: Math.max(0, S.respostas.findIndex((r) => r == null)) });
  };

  return (
    <Page anim={anim} cls="notab">
      <Topo titulo="Exercício 2" />
      <div className="hero" style={{ height: 400 }}>
        <img src="img/ex2.jpg" alt="" />
        <div className="in">
          <div className="eyebrow">Exercício 2 · Buscando respostas</div>
          <h1 className="display" style={{ fontSize: 40 }}>Águia, Gato, Tubarão ou Lobo?</h1>
        </div>
      </div>
      <div className="stagger">
        <p className="sub" style={{ marginTop: 16 }}>Este teste vai te ajudar a compreender melhor alguns comportamentos, padrões e características que influenciam diretamente a forma como você age, sente, reage e se relaciona com a vida.</p>
        <div className="animals">
          {ORDEM.map((k) => <div key={k}><img src={PERFIS[k].th} alt="" /><b>{PERFIS[k].nome}</b></div>)}
        </div>
        <div className="pills">
          <span className="pill"><Icon n="q" /> 25 perguntas</span>
          <span className="pill"><Icon n="clock" /> ~5 min</span>
          <span className="pill"><Icon n="check" /> 1 escolha cada</span>
        </div>
        <p>Ao responder, procure não racionalizar demais. Escolha aquilo que realmente se aproxima de quem você é <i>hoje</i>.</p>
        <div className="quote" style={{ margin: "18px 0 10px" }}>O objetivo do autoconhecimento não é criar rótulos, mas despertar consciência.</div>
      </div>
      <div className="dock">
        {feitas === 25 ? (
          <div className="row">
            <button className="btn line" id="refaz" onClick={() => refazerTeste()}><Icon n="redo" /> Refazer</button>
            <button className="btn gold" id="ver" onClick={() => { haptic(); aba("perfil"); }}>Ver resultado</button>
          </div>
        ) : (
          <button className="btn gold block" id="go" onClick={comecar}>
            {feitas ? `Continuar da pergunta ${feitas + 1}` : "Começar o teste"}
          </button>
        )}
      </div>
    </Page>
  );
}

export function Quiz({ arg }) {
  const app = useApp();
  const [i, setI] = useState(arg.i);
  const [dir, setDir] = useState("r");
  const [saindo, setSaindo] = useState(false);
  const [ripple, setRipple] = useState(null);
  const travado = useRef(false);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const [q, ops] = PERGUNTAS[i];
  const sel = app.respostas[i];

  useEffect(() => { cena("img/ex2.jpg", 0.15 + (i / 25) * 0.8); }, [i]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const goto = (n, d) => {
    travado.current = false;
    setSaindo(false);
    setRipple(null);
    setDir(d);
    setI(n);
  };

  const fim = () => {
    const falta = S.respostas.findIndex((r) => r == null);
    if (falta >= 0) { toast("Falta responder uma pergunta", "q"); goto(falta, "l"); return; }
    trocar("busca", arg.f);
  };

  const escolher = (j, e) => {
    if (travado.current) return;
    travado.current = true;
    haptic(10);
    const r = e.currentTarget.getBoundingClientRect(), d = Math.max(r.width, r.height);
    const cx = (e.clientX || r.left + r.width / 2) - r.left, cy = (e.clientY || r.top + r.height / 2) - r.top;
    setRipple({ j, d, x: cx - d / 2, y: cy - d / 2, id: Date.now() });
    const nova = S.respostas[i] == null;
    S.respostas[i] = j;
    commit();
    if (nova) luz(1);
    later(() => {
      if (i < 24) { setSaindo(true); later(() => goto(i + 1, "r"), 250); }
      else fim();
    }, 420);
  };

  const profundidade = (i + (sel != null ? 1 : 0)) * 4;

  return (
    <div className="quiz anim-fade">
      <div className="qtop">
        <button className="ib" id="x" aria-label="Sair do teste" onClick={() => { haptic(); voltarHist(); }}><Icon n="close" /></button>
        <div className="meta">{i + 1} / 25</div>
        <div className="depth"><Icon n="wave" /><span>{profundidade} m</span></div>
      </div>
      <div className="segs">
        {PERGUNTAS.map((_, k) => <i key={k} className={app.respostas[k] != null ? "on" : k === i ? "now" : ""} />)}
      </div>
      <div className="qbody">
        <div key={i} className={`paper qcard ${saindo ? "out" : "in-" + dir}`}>
          <div className="eyebrow">Pergunta {i + 1}</div>
          <h2 className="display">{q}</h2>
          <div className="opts" role="radiogroup">
            {ops.map(([, t], j) => (
              <button key={j} className={"opt" + (sel === j ? " sel" : "")} role="radio" aria-checked={sel === j} onClick={(e) => escolher(j, e)}>
                <span className="rd" />
                <span>{t}</span>
                {ripple && ripple.j === j && (
                  <span key={ripple.id} className="ripple" style={{ width: ripple.d, height: ripple.d, left: ripple.x, top: ripple.y }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="qnav">
        <button id="pv" disabled={i === 0} onClick={() => { if (i > 0) { haptic(); goto(i - 1, "l"); } }}><Icon n="back" /> Anterior</button>
        <span className="hint">o que mais se aproxima de você hoje</span>
        <button id="nxq" disabled={sel == null} onClick={() => { if (sel == null) return; haptic(); i < 24 ? goto(i + 1, "r") : fim(); }}>Próxima <Icon n="chev" /></button>
      </div>
    </div>
  );
}

const MSGS = ["Somando suas escolhas", "Lendo seus padrões", "Revelando seu perfil"];

export function Busca({ arg: f }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    cena("img/teste.jpg", 1);
    bolhas(26);
    const t1 = setTimeout(() => setK(1), 900);
    const t2 = setTimeout(() => setK(2), 1800);
    const t3 = setTimeout(() => trocar("revela", f), 2900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="seek anim-fade">
      <div>
        <div className="rings"><i /><i /><i /><div className="core" /></div>
        <div className="eyebrow">100 metros de profundidade</div>
        <h2 className="display" style={{ fontSize: 38, marginTop: 8 }}>Buscando respostas…</h2>
        <div className="stx" key={k} id="stx">{MSGS[k]}</div>
      </div>
    </div>
  );
}

export function Revela() {
  const [virada, setVirada] = useState(false);
  const [depois, setDepois] = useState(false);
  const ok = testeOk();
  const r = ok ? perfil() : null;
  const P = r && PERFIS[r.top[0]];

  useEffect(() => {
    if (!ok) { aba("jornada"); return; }
    cena(P.img, 0.6);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ok) return null;
  const { pct, top } = r;

  const virar = () => {
    if (virada) return;
    setVirada(true);
    haptic([15, 30, 25]);
    setTimeout(() => { explosao(60); bolhas(20); setDepois(true); }, 700);
  };

  return (
    <div className="reveal anim-fade">
      <div className="eyebrow">{S.nome ? S.nome + ", seu" : "Seu"} perfil foi revelado</div>
      <div className={"flip" + (virada ? " on" : "")} id="fl" role="button" tabIndex={0} aria-label="Revelar carta"
        onClick={virar} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); virar(); } }}>
        <div className="inner">
          <div className="face back"><img src="img/logo.png" alt="" /><div className="tap">Toque para revelar</div></div>
          <div className="face front">
            <div className="frame" />
            <div className="pic"><img src={P.img} alt={P.nome} /></div>
            <div className="txt">
              <div className="pct">{pct[top[0]]}%</div>
              <h2 style={top.length > 1 ? { fontSize: 32 } : undefined}>{nomesTop(top)}</h2>
              <div className="tags">{P.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={"after" + (depois ? " on" : "")} id="af">
        <p className="sub" style={{ marginBottom: 16 }}>
          {top.length > 1
            ? "Seus perfis predominantes empataram — você transita entre eles com a mesma intensidade."
            : "Este é o seu comportamento predominante neste momento da sua vida."}
        </p>
        <button className="btn gold block" id="ver" onClick={() => { haptic(); aba("perfil"); checarFase(FASES[0]); }}>Ver meu mapa completo</button>
      </div>
    </div>
  );
}
