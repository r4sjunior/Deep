import { useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import { Page, Topo } from "../components/Chrome.jsx";
import { useApp } from "../lib/store.js";
import { cena, haptic, toast } from "../lib/ui.jsx";
import { aba, ir } from "../lib/nav.js";
import { abrirPasso } from "../lib/acoes.jsx";
import {
  faseFeita, faseLivre, passoFeito, proximoPasso, infoPasso, respondidas, escreveuEm, saudacao
} from "../lib/regras.js";
import { FASES, PENSAMENTOS } from "../data/jornada.jsx";

const C = 2 * Math.PI * 33;

export default function Jornada({ anim }) {
  const S = useApp();
  const feitas = FASES.filter(faseFeita).length;
  const pct = Math.round((feitas / 4) * 100);
  const nx = proximoPasso();
  const cur = nx ? FASES.indexOf(nx.f) : -1;
  const info = nx && infoPasso(nx.p);
  const pens = PENSAMENTOS[new Date().getDate() % PENSAMENTOS.length];
  const iniciado = nx && (nx.p.t === "teste" ? respondidas() > 0 : escreveuEm(nx.p.k));
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
      <div className="stagger">
        <div className="hello">
          <div className="eyebrow">{saudacao()}{S.nome ? "," : ""}</div>
          <h1 className="display">{S.nome || "Que bom te ver"}</h1>
        </div>

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
          <div>
            <div className="eyebrow">Método DEEP</div>
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

        <div className="glass thought">
          <div className="eyebrow">Pensamento do dia</div>
          <div className="quote" style={{ marginTop: 10 }}>{pens}</div>
        </div>
      </div>
    </Page>
  );
}
