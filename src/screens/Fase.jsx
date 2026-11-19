import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../components/Icon.jsx";
import { Split, Placas } from "../components/Chrome.jsx";
import { useApp, S, persistir } from "../lib/store.js";
import { cena, haptic, toast, bolhas, reduz } from "../lib/ui.jsx";
import { voltarHist } from "../lib/nav.js";
import { abrirPasso, concluirPasso, luz } from "../lib/acoes.jsx";
import { faseDe, infoPasso, passoFeito, passoLivre, palavras, escreveuEm } from "../lib/regras.js";
import { EX, FASES, LEITURAS } from "../data/jornada.jsx";

export function Fase({ arg: id, anim }) {
  useApp();
  const f = faseDe(id), i = FASES.indexOf(f);
  const j0 = f.passos.findIndex((p) => !passoFeito(p));

  useEffect(() => { cena(f.img, i * 0.2 + 0.05); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const abrir = (j) => {
    if (!passoLivre(f, j)) { haptic(30); toast("Conclua o passo anterior primeiro", "lock"); return; }
    haptic();
    abrirPasso(f, j);
  };

  return (
    <Split anim={anim} titulo={f.nome} img={f.img}
      over={<>
        <div className="eyebrow">Fase {i + 1} do game · {f.prof}</div>
        <h1 className="display">{f.titulo}!!!</h1>
        <p className="lead">{f.lead}</p>
      </>}
      dock={j0 >= 0 ? (
        <button className="btn gold block" id="go" onClick={() => { haptic(); bolhas(10); abrirPasso(f, j0); }}>
          {f.passos.some(passoFeito) ? "Continuar" : "Mergulhar"} · passo {j0 + 1}
        </button>
      ) : (
        <button className="btn line block" onClick={() => { haptic(); voltarHist(); }}><Icon n="check" /> Fase concluída</button>
      )}>
      <div className="stagger">
        <div className="read sub" style={{ marginTop: 18 }}>{f.texto.map((t, k) => <p key={k}>{t}</p>)}</div>
        <div className="quote" style={{ margin: "20px 0 6px" }}>{f.citacao}</div>
        <div className="sec"><h3>Passos desta fase</h3><span>{f.passos.filter(passoFeito).length} de {f.passos.length}</span></div>
        <div className="steps">
          {f.passos.map((p, j) => {
            const inf = infoPasso(p), ok = passoFeito(p), lv = passoLivre(f, j);
            return (
              <button key={p.k} className={"step " + (ok ? "done" : !lv ? "lock" : j === j0 ? "cur" : "")} onClick={() => abrir(j)}>
                <div className="n">{ok ? <Icon n="check" /> : !lv ? <Icon n="lock" /> : j + 1}</div>
                <div className="tx">
                  <strong>{inf.titulo}</strong>
                  <span><Icon n={inf.icone} /> {inf.tipo} · {inf.min} min</span>
                </div>
                <Icon n="chev" />
              </button>
            );
          })}
        </div>
      </div>
    </Split>
  );
}

/** Caderno pautado que cresce com o texto. */
function Caderno({ id, valor, onChange }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ta = ref.current;
    ta.style.height = "auto";
    ta.style.height = Math.max(150, ta.scrollHeight + 4) + "px";
  }, [valor]);
  return (
    <textarea ref={ref} className="journal" data-c={id} placeholder="Escreva livremente…" rows={4}
      value={valor} onChange={(e) => onChange(e.target.value)} />
  );
}

/** "Então respire fundo… e simplesmente escreva." — três respirações guiadas antes de escrever. */
function Respiracao({ onFim }) {
  const [fase, setFase] = useState(0); // 0..5 → inspira/expira × 3
  useEffect(() => {
    if (reduz) return;
    if (fase >= 6) { onFim(); return; }
    const t = setTimeout(() => setFase((n) => n + 1), 4000);
    return () => clearTimeout(t);
  }, [fase]); // eslint-disable-line react-hooks/exhaustive-deps

  return createPortal(
    <div className="breath" role="dialog" aria-label="Respiração guiada">
      <div className="box">
        <div className="eyebrow">Antes de escrever</div>
        <h2 className="display" style={{ fontSize: 30, margin: "8px 0 4px" }}>Respire fundo…</h2>
        <p className="sub">e simplesmente escreva. Acompanhe a luz por três respirações.</p>
        <div className="bcirc"><b>{reduz ? "Respire" : fase % 2 === 0 ? "Inspire" : "Expire"}</b></div>
        <div className="cnt">{reduz ? "no seu tempo" : `${Math.min(3, Math.floor(fase / 2) + 1)} de 3`}</div>
        <div className="row">
          <button className="btn gold" id="pronto" onClick={onFim}>Estou pronto(a)</button>
        </div>
      </div>
    </div>,
    document.getElementById("shell")
  );
}

export function Exercicio({ arg: { f, k }, anim }) {
  const e = EX[k], F = faseDe(f);
  const [textos, setTextos] = useState(() => ({ ...(S.textos[k] || {}) }));
  const [salvo, setSalvo] = useState(false);
  const [faltando, setFaltando] = useState([]);
  const [respirar, setRespirar] = useState(() => !S.feito[k] && !escreveuEm(k));
  const tSalvo = useRef(0);

  useEffect(() => {
    cena(e.img, FASES.indexOf(F) * 0.2 + 0.1);
    return () => clearTimeout(tSalvo.current);
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps

  const escrever = (c, v) => {
    setTextos((t) => ({ ...t, [c]: v }));
    if (palavras(v)) setFaltando((l) => l.filter((x) => x !== c));
    S.textos[k] = { ...(S.textos[k] || {}), [c]: v };
    persistir();
    setSalvo(true);
    clearTimeout(tSalvo.current);
    tSalvo.current = setTimeout(() => setSalvo(false), 1400);
  };

  // todas as perguntas são obrigatórias: só conclui com todos os campos escritos
  const concluir = () => {
    const vazios = e.campos.map(([c]) => c).filter((c) => !palavras(textos[c]));
    if (vazios.length) {
      haptic(30);
      setFaltando(vazios);
      toast(vazios.length === e.campos.length
        ? "Escreva sua resposta para concluir o exercício"
        : `Falta responder ${vazios.length === 1 ? "1 pergunta" : vazios.length + " perguntas"}`, "pen");
      const ta = document.querySelector(`textarea[data-c="${vazios[0]}"]`);
      if (ta) { ta.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "center" }); ta.focus({ preventScroll: true }); }
      return;
    }
    haptic(14);
    if (!S.feito[k]) {
      luz(3);
      toast("+3 luzes · obrigado pela sua verdade");
    }
    concluirPasso(f, k);
  };

  return (
    <>
      <Split anim={anim} short titulo={"Exercício " + e.n} img={e.img}
        over={<Placas a={`Exercício ${e.n}`} b={e.titulo} />}
        dock={
          <div className="row" style={{ alignItems: "center" }}>
            <span className={"saved" + (salvo ? " on" : "")} style={{ flex: "0 0 auto" }}><Icon n="check" /> Salvo</span>
            <button className="btn gold" id="ok" onClick={concluir}>{S.feito[k] ? "Salvar e voltar" : "Concluir exercício"}</button>
          </div>
        }>
        <div className="paper pad ex-card">
          <span className="wm" aria-hidden="true">Exercício {e.n}</span>
          <div className="eyebrow">Exercício {e.n} · {F.nome}</div>
          <h2 className="display" style={{ margin: "6px 0 12px" }}>{e.titulo}</h2>
          <div className="read">{e.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
          <div className="lembre">
            <h4>Lembre-se:</h4>
            <p>{e.lembre} <b>Sem julgamentos. Sem críticas. Sem medo de errar.</b></p>
          </div>
          {e.campos.map(([c, l], i) => {
            const n = palavras(textos[c]);
            return (
              <label className={"field" + (faltando.includes(c) ? " falta" : "")} key={c}>
                <div className="prompt">{e.campos.length > 1 && <i>{i + 1}</i>}{l}</div>
                <Caderno id={c} valor={textos[c] || ""} onChange={(v) => escrever(c, v)} />
                <div className="wc">{n ? `${n} palavra${n > 1 ? "s" : ""}` : faltando.includes(c) ? "resposta obrigatória" : ""}</div>
              </label>
            );
          })}
        </div>
      </Split>
      {respirar && <Respiracao onFim={() => { setRespirar(false); bolhas(8); }} />}
    </>
  );
}

export function Leitura({ arg: { f, k }, anim }) {
  const l = LEITURAS[k], F = faseDe(f);
  useEffect(() => { cena(l.img, FASES.indexOf(F) * 0.2 + 0.1); }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  const concluir = () => {
    haptic(14);
    if (!S.feito[k]) luz(1);
    concluirPasso(f, k);
  };
  return (
    <Split anim={anim} short titulo="Leitura" img={l.img}
      over={<Placas a="Leitura" b={l.titulo} />}
      dock={<button className="btn gold block" id="ok" onClick={concluir}>{S.feito[k] ? "Voltar" : "Concluir leitura"}</button>}>
      <div className="paper pad ex-card">
        <span className="wm" aria-hidden="true">{F.nome}</span>
        <div className="eyebrow">{F.nome} · leitura</div>
        <h2 className="display" style={{ margin: "6px 0 14px" }}>{l.titulo}</h2>
        <div className="read">{l.corpo}</div>
      </div>
    </Split>
  );
}
