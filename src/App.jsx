import Oceano from "./components/Oceano.jsx";
import { Modal, Side, Tabs, Toast } from "./components/Chrome.jsx";
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

export default function App() {
  const { pilha, anim, key } = nav.use();
  const topo = pilha[pilha.length - 1];
  const Tela = topo.rota === "aba" ? ABAS[topo.arg] : ROTAS[topo.rota];
  const abaAtiva = topo.rota === "aba" ? topo.arg : null;

  return (
    <>
      <Oceano />
      <Side />
      <div id="shell">
        {/* a key remonta a área de rolagem a cada troca de tela (volta ao topo) */}
        <main id="view" key={key}>
          <Tela arg={topo.arg} anim={anim} />
        </main>
        <Tabs ativa={abaAtiva} />
        <Modal />
        <div id="fx" />
        <Toast />
      </div>
    </>
  );
}
