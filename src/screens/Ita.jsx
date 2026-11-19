import { useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import { Page, Topo } from "../components/Chrome.jsx";
import { useApp, S, commit, resetar } from "../lib/store.js";
import { cena, modal, confirmar, toast } from "../lib/ui.jsx";
import { definir } from "../lib/nav.js";
import { imprimir, linkWhats } from "../lib/acoes.jsx";
import { perfil, testeOk, nomesTop } from "../lib/regras.js";
import { CONTATO } from "../data/jornada.jsx";

const DIAGNOSTICO = [
  "o que está consumindo sua energia emocional",
  "quais padrões podem estar se repetindo em sua vida",
  "o que pode estar impedindo você de viver com mais leveza e clareza",
  "quais podem ser os próximos passos da sua transformação"
];

function NomeSheet({ close }) {
  const [v, setV] = useState(S.nome);
  const salvar = () => { S.nome = v.trim(); commit(); close(); toast("Nome atualizado", "check"); };
  return (
    <div className="sheet">
      <div className="grab" />
      <h3 className="display" style={{ fontSize: 28 }}>Como quer ser chamado(a)?</h3>
      <input className="input" id="nn" maxLength={40} style={{ margin: "16px 0" }} autoFocus value={v}
        onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") salvar(); }} />
      <div className="row">
        <button className="btn line" onClick={close}>Cancelar</button>
        <button className="btn plum" id="sn" onClick={salvar}>Salvar</button>
      </div>
    </div>
  );
}

export default function Ita({ anim }) {
  useApp();
  useEffect(() => { cena("img/capa.jpg", 0.25); }, []);
  const p = testeOk() ? perfil() : null;
  const zap = linkWhats(
    `Olá, Ita! Fiz o mergulho DEEP${p ? ` e meu perfil predominante deu ${nomesTop(p.top)} (${p.pct[p.top[0]]}%)` : ""}. Quero agendar o Diagnóstico da Alma.`
  );

  const recomecar = () =>
    confirmar(
      "Recomeçar do zero?",
      "Todas as respostas, textos e luzes deste aparelho serão apagados. Isso não pode ser desfeito.",
      () => { resetar(); definir([{ rota: "onb" }], "fade"); },
      "Apagar tudo"
    );

  return (
    <Page anim={anim}>
      <Topo back={false} titulo="Ita Batista" />
      <div className="author-hero">
        <img src="img/autora.jpg" alt="Ita Batista" />
        <div className="in">
          <div className="eyebrow">A autora</div>
          <div className="sign">Ita Batista</div>
          <p className="sub" style={{ fontSize: 15, marginTop: 4 }}>Mentora, Analista Comportamental, Coach e Especialista em Eneagrama Master Practitioner</p>
        </div>
      </div>
      <div className="stagger">
        <div className="read sub" style={{ marginTop: 18 }}>
          <p>Por muito tempo, procurei respostas fora. Foi nessa busca que o autoconhecimento deixou de ser apenas um interesse e passou a fazer parte da minha própria jornada.</p>
          <p>Não quero dizer a você qual caminho deve seguir. Quero oferecer perguntas, reflexões e ferramentas que ajudem você a olhar para si com mais consciência.</p>
        </div>

        <div className="plumbox" style={{ marginTop: 22 }}>
          <div className="eyebrow" style={{ color: "var(--gold-2)" }}>Sessão gratuita</div>
          <h3 className="display" style={{ fontSize: 30, margin: "6px 0" }}>Diagnóstico da Alma</h3>
          <p style={{ fontSize: 16, color: "rgba(245,236,212,.85)" }}>Um momento de escuta, acolhimento e direcionamento para identificar:</p>
          <div className="bullets">{DIAGNOSTICO.map((t) => <div key={t}><Icon n="spark" /><span>{t}</span></div>)}</div>
          <a className="btn gold block" href={zap} target="_blank" rel="noopener noreferrer"><Icon n="cal" /> Quero agendar</a>
        </div>

        <div className="sec"><h3>Vamos continuar conectadas</h3></div>
        <div className="links">
          <a className="lk" href={`https://instagram.com/${CONTATO.insta}`} target="_blank" rel="noopener noreferrer">
            <span className="ic"><Icon n="insta" /></span><div><b>Instagram</b><span>@{CONTATO.insta}</span></div><Icon n="chev" />
          </a>
          <a className="lk" href={linkWhats()} target="_blank" rel="noopener noreferrer">
            <span className="ic"><Icon n="whats" /></span><div><b>WhatsApp</b><span>{CONTATO.whatsLabel}</span></div><Icon n="chev" />
          </a>
          <a className="lk" href={`https://youtube.com/@${CONTATO.youtube}`} target="_blank" rel="noopener noreferrer">
            <span className="ic"><Icon n="yt" /></span><div><b>YouTube</b><span>@{CONTATO.youtube}</span></div><Icon n="chev" />
          </a>
        </div>

        <div className="sec"><h3>Seus dados</h3></div>
        <div className="links">
          <button className="lk" id="pdf" onClick={imprimir}>
            <span className="ic"><Icon n="down" /></span><div><b>Salvar meu mergulho em PDF</b><span>Perfil e respostas do diário</span></div>
          </button>
          <button className="lk" id="nomeB" onClick={() => modal((close) => <NomeSheet close={close} />)}>
            <span className="ic"><Icon n="pen" /></span><div><b>Alterar meu nome</b><span>{S.nome || "Sem nome"}</span></div>
          </button>
          <button className="lk" id="reset" onClick={recomecar}>
            <span className="ic danger"><Icon n="redo" /></span><div><b className="danger">Recomeçar a jornada</b><span>Apaga as respostas deste aparelho</span></div>
          </button>
        </div>
      </div>
    </Page>
  );
}
