import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import Radar from "../components/Radar.jsx";
import { Page, Topo, Split } from "../components/Chrome.jsx";
import { gerarCard } from "../lib/card.js";
import { useApp, S, commit } from "../lib/store.js";
import { cena, haptic, toast, modal } from "../lib/ui.jsx";
import { definir, ir } from "../lib/nav.js";
import { refazerTeste } from "../lib/acoes.jsx";
import { perfil, respondidas, testeOk, nomesTop } from "../lib/regras.js";
import { ORDEM, PERFIS } from "../data/perfis.js";

const SEGS = [["resumo", "Resumo"], ["pot", "Potências"], ["eq", "Equilíbrio"], ["todos", "Todos"]];
let segLembrado = "resumo";
const BASE_TESTE = [{ rota: "aba", arg: "perfil" }, { rota: "fase", arg: "despertar" }];

function SemPerfil({ anim }) {
  const feitas = respondidas();
  useEffect(() => { cena("img/ex2.jpg", 0.2); }, []);
  return (
    <Page anim={anim}>
      <Topo back={false} titulo="Perfil" />
      <div className="empty stagger">
        <img src="img/teste.jpg" alt="" />
        <div className="eyebrow">Exercício 2</div>
        <h2 className="display" style={{ margin: "8px 0" }}>Seu perfil ainda não foi revelado</h2>
        <p className="sub" style={{ marginBottom: 22 }}>
          Descubra se hoje você se aproxima mais da Águia, do Gato, do Tubarão ou do Lobo.
          {feitas > 0 && ` Você já respondeu ${feitas} de 25.`}
        </p>
        <button className="btn gold block" id="go" onClick={() => { haptic(); definir(BASE_TESTE); ir("testeIntro", "despertar"); }}>
          {feitas ? "Continuar o teste" : "Fazer o teste"}
        </button>
      </div>
    </Page>
  );
}

function Barras({ ord, pct, top }) {
  const [cheio, setCheio] = useState(false);
  useEffect(() => { const t = setTimeout(() => setCheio(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div className="bars">
      {ord.map((k) => (
        <div key={k} className={"bar" + (top.includes(k) ? " top" : "")}>
          <img src={PERFIS[k].th} alt="" />
          <div>
            <div className="nm">{PERFIS[k].nome}<small>{PERFIS[k].curto.toUpperCase()}</small></div>
            <div className="tr"><i style={{ width: cheio ? pct[k] + "%" : 0, background: PERFIS[k].cor }} /></div>
          </div>
          <div className="v">{pct[k]}%</div>
        </div>
      ))}
    </div>
  );
}

export default function Perfil({ anim }) {
  useApp();
  const [seg, setSeg] = useState(segLembrado);
  const segRef = useRef(null);
  const ok = testeOk();
  const r = ok ? perfil() : null;

  useEffect(() => {
    if (!ok) return;
    if (!S.vistoPerfil) { S.vistoPerfil = true; commit(); }
    cena(PERFIS[r.top[0]].img, 0.45);
  }, [ok]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ok) return <SemPerfil anim={anim} />;

  const { pct, top } = r;
  const P = PERFIS[top[0]];
  const ord = [...ORDEM].sort((a, b) => pct[b] - pct[a]);

  const trocarSeg = (s) => {
    haptic();
    segLembrado = s;
    setSeg(s);
    const v = document.getElementById("view"), el = segRef.current;
    if (v && el && v.scrollTop > el.offsetTop - 70) v.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
  };

  const compartilhar = async () => {
    const txt = `Fiz o mergulho DEEP da Ita Batista e meu perfil comportamental predominante hoje é ${nomesTop(top)} (${pct[top[0]]}%). ${ORDEM.map((k) => `${PERFIS[k].nome} ${pct[k]}%`).join(" · ")}`;
    try {
      if (navigator.share) { await navigator.share({ title: "Meu perfil DEEP", text: txt }); return; }
      await navigator.clipboard.writeText(txt);
      toast("Resultado copiado", "check");
    } catch (e) { /* cancelado */ }
  };

  const abrirCard = async () => {
    haptic();
    toast("Preparando seu card…", "spark");
    let blob;
    try { blob = await gerarCard(); } catch (e) { toast("Não foi possível gerar o card", "close"); return; }
    const url = URL.createObjectURL(blob);
    const arquivo = new File([blob], "meu-perfil-deep.png", { type: "image/png" });
    const podeEnviar = !!(navigator.canShare && navigator.canShare({ files: [arquivo] }));
    const enviar = async () => {
      try { await navigator.share({ files: [arquivo], title: "Meu perfil DEEP" }); } catch (e) { /* cancelado */ }
    };
    modal((close) => (
      <div className="sheet story">
        <div className="grab" />
        <div className="eyebrow">Card para Stories</div>
        <h3 className="display" style={{ fontSize: 26, margin: "6px 0 16px" }}>Seu perfil, pronto para compartilhar</h3>
        <img src={url} alt="Card do seu perfil DEEP" id="cardimg" />
        <div className="row">
          <a className="btn line" href={url} download="meu-perfil-deep.png" onClick={() => setTimeout(close, 300)}><Icon n="down" /> Baixar</a>
          {podeEnviar
            ? <button className="btn gold" onClick={enviar}><Icon n="share" /> Enviar</button>
            : <button className="btn gold" onClick={close}>Fechar</button>}
        </div>
      </div>
    ));
  };

  return (
    <Split aba anim={anim} titulo="Seu perfil" img={P.img} alt={P.nome}
      over={<>
        <div className="eyebrow">{S.nome ? S.nome + " · " : ""}perfil predominante hoje</div>
        <div className="big">{pct[top[0]]}%</div>
        <h1 className="display">{nomesTop(top)}</h1>
      </>}>

      <div className="seg" id="seg" role="tablist" ref={segRef}>
        {SEGS.map(([k, l]) => (
          <button key={k} role="tab" data-s={k} aria-selected={k === seg} className={k === seg ? "on" : ""} onClick={() => trocarSeg(k)}>{l}</button>
        ))}
      </div>

      <div className="stagger" key={seg}>
        {seg === "resumo" && (
          <>
            <div className="glass" style={{ padding: "14px 6px 6px" }}><Radar pct={pct} /></div>
            <div className="sec"><h3>Seu mapa comportamental</h3></div>
            <Barras ord={ord} pct={pct} top={top} />
            {top.map((k) => (
              <div key={k}>
                <div className="sec"><h3>Sobre o {PERFIS[k].nome}</h3></div>
                <div className="read sub">{PERFIS[k].texto.map((t, i) => <p key={i}>{t}</p>)}</div>
              </div>
            ))}
            <div className="plumbox" style={{ marginTop: 22 }}>
              <div className="eyebrow" style={{ color: "var(--gold-2)" }}>Lembre-se</div>
              <h3 className="display" style={{ fontSize: 24, margin: "6px 0 8px" }}>Nenhum perfil é totalmente bom ou totalmente ruim</h3>
              <p style={{ fontSize: 16, color: "rgba(245,236,212,.85)" }}>Tudo na vida precisa de equilíbrio. O verdadeiro propósito desse teste não é criar rótulos, e sim despertar consciência sobre os comportamentos que estão em evidência em você hoje.</p>
            </div>
          </>
        )}

        {seg === "pot" && (
          <>
            {top.map((k) => (
              <div key={k}>
                <div className="sec" style={{ marginTop: 4 }}><h3>{PERFIS[k].nome}: o que te fortalece</h3></div>
                <div className="list">
                  {PERFIS[k].potencias.map((x) => <div className="li" key={x}><span className="ic"><Icon n="spark" /></span><b>{x}</b></div>)}
                </div>
              </div>
            ))}
            <p className="sub" style={{ marginTop: 18 }}>Quando entendemos o “porquê” de determinados comportamentos, podemos usar a potencialidade de cada perfil sem ficar presos aos padrões automáticos.</p>
          </>
        )}

        {seg === "eq" && (
          <>
            {top.map((k) => (
              <div key={k}>
                <div className="sec" style={{ marginTop: 4 }}><h3>{PERFIS[k].nome}: o que pede equilíbrio</h3></div>
                <div className="list">
                  {PERFIS[k].equilibrio.map((x) => <div className="li eq" key={x}><span className="ic"><Icon n="scale" /></span><b>{x}</b></div>)}
                </div>
                <div className="glass pad" style={{ marginTop: 14 }}>
                  <div className="eyebrow">Pergunta para levar com você</div>
                  <div className="quote" style={{ marginTop: 10 }}>{PERFIS[k].pergunta}</div>
                </div>
              </div>
            ))}
            <p className="sub" style={{ marginTop: 18 }}>E talvez… você não tenha gostado do resultado. E sabe de uma coisa? Isso é muito bom. Porque, pela primeira vez, talvez você tenha começado a sair da tão falada zona de conforto.</p>
          </>
        )}

        {seg === "todos" && ord.map((k) => (
          <details className="acc" key={k} open={top.includes(k)}>
            <summary><img src={PERFIS[k].th} alt="" /><strong>{PERFIS[k].nome}</strong><em>{pct[k]}%</em><Icon n="chev" /></summary>
            <div className="read">{PERFIS[k].texto.map((t, i) => <p key={i}>{t}</p>)}</div>
          </details>
        ))}
      </div>

      <button className="btn gold block" id="story" style={{ marginTop: 24 }} onClick={abrirCard}><Icon n="spark" /> Criar meu card para Stories</button>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn line" id="refaz" onClick={() => refazerTeste(BASE_TESTE)}><Icon n="redo" /> Refazer</button>
        <button className="btn plum" id="share" onClick={compartilhar}><Icon n="share" /> Texto</button>
      </div>
    </Split>
  );
}
