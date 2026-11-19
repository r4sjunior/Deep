import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { Page, Topo } from "../components/Chrome.jsx";
import { useApp, S, persistir } from "../lib/store.js";
import { cena, haptic, toast, bolhas, confirmar } from "../lib/ui.jsx";
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
    <Page anim={anim} cls="notab">
      <Topo titulo={f.nome} />
      <div className="hero">
        <img src={f.img} alt="" />
        <div className="in">
          <div className="eyebrow">Fase {i + 1} do game · {f.prof}</div>
          <h1 className="display">{f.titulo}</h1>
          <p className="lead">{f.lead}</p>
        </div>
      </div>
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
      <div className="dock">
        {j0 >= 0 ? (
          <button className="btn gold block" id="go" onClick={() => { haptic(); bolhas(10); abrirPasso(f, j0); }}>
            {f.passos.some(passoFeito) ? "Continuar" : "Mergulhar"} · passo {j0 + 1}
          </button>
        ) : (
          <button className="btn line block" onClick={() => { haptic(); voltarHist(); }}><Icon n="check" /> Fase concluída</button>
        )}
      </div>
    </Page>
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

export function Exercicio({ arg: { f, k }, anim }) {
  const e = EX[k], F = faseDe(f);
  const [textos, setTextos] = useState(() => ({ ...(S.textos[k] || {}) }));
  const [salvo, setSalvo] = useState(false);
  const tSalvo = useRef(0);

  useEffect(() => {
    cena(e.img, FASES.indexOf(F) * 0.2 + 0.1);
    return () => clearTimeout(tSalvo.current);
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps

  const escrever = (c, v) => {
    setTextos((t) => ({ ...t, [c]: v }));
    S.textos[k] = { ...(S.textos[k] || {}), [c]: v };
    persistir();
    setSalvo(true);
    clearTimeout(tSalvo.current);
    tSalvo.current = setTimeout(() => setSalvo(false), 1400);
  };

  const concluir = () => {
    const escreveu = escreveuEm(k);
    const fazer = () => {
      haptic(14);
      if (!S.feito[k]) {
        luz(escreveu ? 3 : 1);
        toast(escreveu ? "+3 luzes · obrigado pela sua verdade" : "+1 luz · volte para escrever quando quiser");
      }
      concluirPasso(f, k);
    };
    if (!escreveu && !S.feito[k]) {
      confirmar("Seguir sem escrever?", "Tudo bem seguir agora e voltar depois pelo Diário. Mas lembre: este é um material para ser vivido.", fazer, "Seguir assim");
    } else fazer();
  };

  return (
    <Page anim={anim} cls="notab">
      <Topo titulo={"Exercício " + e.n} />
      <div className="ex-head"><img src={e.img} alt="" /></div>
      <div className="paper pad ex-card">
        <div className="eyebrow">Exercício {e.n} · {F.nome}</div>
        <h2 className="display" style={{ margin: "6px 0 12px" }}>{e.titulo}</h2>
        <div className="read">{e.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
        {e.campos.map(([c, l], i) => {
          const n = palavras(textos[c]);
          return (
            <label className="field" key={c}>
              <div className="prompt">{e.campos.length > 1 && <i>{i + 1}</i>}{l}</div>
              <Caderno id={c} valor={textos[c] || ""} onChange={(v) => escrever(c, v)} />
              <div className="wc">{n ? `${n} palavra${n > 1 ? "s" : ""}` : ""}</div>
            </label>
          );
        })}
        <p className="sub" style={{ fontSize: 15, marginTop: 14, fontStyle: "italic" }}>Sem julgamentos. Sem críticas. Sem medo de errar.</p>
      </div>
      <div className="dock">
        <div className="row" style={{ alignItems: "center" }}>
          <span className={"saved" + (salvo ? " on" : "")} style={{ flex: "0 0 auto" }}><Icon n="check" /> Salvo</span>
          <button className="btn gold" id="ok" onClick={concluir}>{S.feito[k] ? "Salvar e voltar" : "Concluir exercício"}</button>
        </div>
      </div>
    </Page>
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
    <Page anim={anim} cls="notab">
      <Topo titulo="Leitura" />
      <div className="ex-head"><img src={l.img} alt="" /></div>
      <div className="paper pad ex-card">
        <div className="eyebrow">{F.nome} · leitura</div>
        <h2 className="display" style={{ margin: "6px 0 14px" }}>{l.titulo}</h2>
        <div className="read">{l.corpo}</div>
      </div>
      <div className="dock">
        <button className="btn gold block" id="ok" onClick={concluir}>{S.feito[k] ? "Voltar" : "Concluir leitura"}</button>
      </div>
    </Page>
  );
}
