import { useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import { Page, Topo } from "../components/Chrome.jsx";
import { useApp, S, commit } from "../lib/store.js";
import { cena, haptic, toast, explosao } from "../lib/ui.jsx";
import { aba, ir } from "../lib/nav.js";
import { abrirPasso, luz } from "../lib/acoes.jsx";
import {
  faseFeita, faseLivre, passoFeito, proximoPasso, infoPasso, respondidas, escreveuEm, saudacao, testeOk, perfil
} from "../lib/regras.js";
import { FASES, CARTAS } from "../data/jornada.jsx";
import { PERFIS } from "../data/perfis.js";

const C = 2 * Math.PI * 33;
const hoje = () => new Date().toLocaleDateString("sv-SE");

/** Carta do dia: uma frase do livro, tirada uma vez por dia. */
function CartaDoDia() {
  const tirada = S.carta && S.carta.dia === hoje() ? S.carta : null;
  const [virada, setVirada] = useState(!!tirada);
  const [idx, setIdx] = useState(tirada ? tirada.i : null);

  const tirar = () => {
    if (virada) return;
    let i = Math.floor(Math.random() * CARTAS.length);
    if (S.carta && S.carta.i === i) i = (i + 1) % CARTAS.length;
    setIdx(i);
    setVirada(true);
    haptic([12, 30, 18]);
    S.carta = { dia: hoje(), i };
    commit();
    setTimeout(() => { explosao(28); luz(1); toast("+1 luz · leve esta frase com você hoje"); }, 650);
  };

  return (
    <div className="carta">
      <div className="sec" style={{ marginTop: 26 }}><h3>Carta do dia</h3><span>{virada ? "volte amanhã para outra" : "uma por dia"}</span></div>
      <div className={"cd" + (virada ? " on" : "")} id="carta" role="button" tabIndex={0} aria-label="Tirar a carta do dia" onClick={tirar}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tirar(); } }}>
        <div className="in2">
          <div className="f b">
            <img src="img/logo.png" alt="" />
            <div><span>Toque para revelar</span><strong>Qual mensagem o mergulho tem para você hoje?</strong><small>Uma frase do DEEP, escolhida ao acaso</small></div>
          </div>
          <div className="f fr">
            <div className="eyebrow">Sua carta de hoje</div>
            <div className="quote">{idx != null ? CARTAS[idx] : ""}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Jornada({ anim }) {
  useApp();
  const feitas = FASES.filter(faseFeita).length;
  const pct = Math.round((feitas / 4) * 100);
  const nx = proximoPasso();
  const cur = nx ? FASES.indexOf(nx.f) : -1;
  const info = nx && infoPasso(nx.p);
  const iniciado = nx && (nx.p.t === "teste" ? respondidas() > 0 : escreveuEm(nx.p.k));
  const animal = testeOk() ? PERFIS[perfil().top[0]] : null;
  const [anel, setAnel] = useState(C);

  useEffect(() => {
    cena(nx ? nx.f.img : "img/capa.jpg", cur < 0 ? 0.2 : cur * 0.18);
    const t = setTimeout(() => setAnel(C * (1 - pct / 100)), 150);
    return () => clearTimeout(t);
  }, [pct, cur]); // eslint-disable-line react-hooks/exhaustive-deps

  const continuar = () => {
    haptic();
    if (!nx) { aba("ita"); return; }
    ir("fase", nx.f.id);
    abrirPasso(nx.f, nx.j);
  };

  const abrirFase = (i) => {
    if (!faseLivre(i)) {
      haptic(30);
      toast(`Conclua “${FASES[i - 1].nome}” para mergulhar mais fundo`, "lock");
      return;
    }
    haptic();
    ir("fase", FASES[i].id);
  };

  return (
    <Page anim={anim}>
      <Topo back={false} titulo="Jornada" />
      <div className="hello hrow anim-fade">
        {animal && <img className="av" src={animal.th} alt={animal.nome} />}
        <div>
          <div className="eyebrow">{saudacao()}{S.nome ? "," : ""}</div>
          <h1 className="display">{S.nome || "Que bom te ver"}</h1>
        </div>
      </div>

      <div className="jgrid">
        <div className="stagger">
          <div className="glass progress-card">
            <div className="ringp">
              <svg viewBox="0 0 78 78">
                <defs>
                  <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fbeec6" /><stop offset="1" stopColor="#e7c564" />
                  </linearGradient>
                </defs>
                <circle className="bg" cx="39" cy="39" r="33" />
                <circle className="fg" cx="39" cy="39" r="33" strokeDasharray={C} strokeDashoffset={anel} />
              </svg>
              <b>{pct}%</b>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="eyebrow">Método DEEP · {nx ? nx.f.prof : "o profundo"}</div>
              <div className="display" style={{ fontSize: 22, marginTop: 2 }}>{nx ? `Fase atual: ${nx.f.nome}` : "Jornada completa"}</div>
              <div className="letters">
                {FASES.map((f, i) => (
                  <i key={f.id} className={faseFeita(f) ? "on" : i === cur ? "cur" : ""}>{f.letra}</i>
                ))}
              </div>
            </div>
          </div>

          {nx ? (
            <button className="next" id="cont" onClick={continuar}>
              <img src={info.img} alt="" />
              <div className="in">
                <div className="eyebrow">Próximo passo · {info.tipo}</div>
                <div className="display">{info.titulo}</div>
                <div className="meta">
                  <Icon n="clock" /> cerca de {info.min} min
                  {nx.p.t === "teste" && respondidas() > 0 && ` · ${respondidas()}/25 respondidas`}
                </div>
                <span className="go">{iniciado ? "Continuar" : "Começar"} <Icon n="chev" /></span>
              </div>
            </button>
          ) : (
            <button className="next" id="cont" onClick={continuar}>
              <img src="img/capa.jpg" alt="" />
              <div className="in">
                <div className="eyebrow">Jornada completa</div>
                <div className="display">Diagnóstico da Alma</div>
                <div className="meta">Quer caminhar ao lado da Ita? A sessão é gratuita.</div>
                <span className="go">Saber mais <Icon n="chev" /></span>
              </div>
            </button>
          )}

          <CartaDoDia />
        </div>

        <div className="stagger">
          <div className="sec"><h3>Seu mergulho</h3><span>{feitas} de 4 fases</span></div>
          <div className="trail">
            {FASES.map((f, i) => {
              const livre = faseLivre(i), ok = faseFeita(f), n = f.passos.filter(passoFeito).length;
              const cls = ok ? "done" : !livre ? "lock" : i === cur ? "cur" : "";
              return (
                <button key={f.id} className={"stop " + cls} data-i={i} onClick={() => abrirFase(i)}>
                  <div className="th">
                    <img src={f.img} alt="" />
                    <span className="st">{ok ? <Icon n="check" /> : !livre ? <Icon n="lock" /> : f.letra}</span>
                  </div>
                  <div className="tx">
                    <div className="eyebrow">Fase {i + 1} · {f.prof}</div>
                    <strong>{f.nome}</strong>
                    <span>{f.resumo}</span>
                    {livre && <div className="mini"><i style={{ width: `${(n / f.passos.length) * 100}%` }} /></div>}
                  </div>
                  <Icon n="chev" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Page>
  );
}
