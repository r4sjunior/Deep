import Oceano from "./components/Oceano.jsx";
import { Modal, Tabs, Toast } from "./components/Chrome.jsx";
import VigiaConquistas from "./components/VigiaConquistas.jsx";
import { nav } from "./lib/nav.js";
import { Splash, Onboarding } from "./screens/Inicio.jsx";
import Jornada from "./screens/Jornada.jsx";
import { Fase, Exercicio, Leitura } from "./screens/Fase.jsx";
import { TesteIntro, Quiz, Busca, Revela } from "./screens/Teste.jsx";
import Perfil from "./screens/Perfil.jsx";
import Diario from "./screens/Diario.jsx";
import Ita from "./screens/Ita.jsx";

const ABAS = { jornada: Jornada, perfil: Perfil, diario: Diario, ita: Ita };

const ROTAS = {
  splash: Splash,
  onb: Onboarding,
  fase: Fase,
  ex: Exercicio,
  ler: Leitura,
  testeIntro: TesteIntro,
  quiz: Quiz,
  busca: Busca,
  revela: Revela
};

/** Telas internas que mantêm o menu lateral nas telas largas. */
const COM_MENU = new Set(["fase", "ex", "ler", "testeIntro"]);

export default function App() {
  const { pilha, anim, key } = nav.use();
  const topo = pilha[pilha.length - 1];
  const naAba = topo.rota === "aba";
  const Tela = naAba ? ABAS[topo.arg] : ROTAS[topo.rota];
  const raiz = pilha[0]?.rota === "aba" ? pilha[0].arg : "jornada";
  const modo = naAba ? "aba" : COM_MENU.has(topo.rota) ? "sub" : null;

  return (
    <>
      <Oceano />
      <div id="shell">
        {/* a key remonta a área de rolagem a cada troca de tela (volta ao topo) */}
        <main id="view" key={key}>
          <Tela arg={topo.arg} anim={anim} />
        </main>
        <Tabs ativa={naAba ? topo.arg : raiz} modo={modo} />
        <Modal />
        <div id="fx" />
        <Toast />
      </div>
      <VigiaConquistas />
    </>
  );
}
