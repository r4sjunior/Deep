import { S } from "./store.js";
import { exEscritos, totalPalavras, testeOk } from "./regras.js";

/** Medalhas do mergulho. `ok()` diz se já foi conquistada. */
export const CONQUISTAS = [
  { id: "inicio", nome: "Primeiro mergulho", desc: "Entrou na jornada", icone: "wave", ok: () => S.inicio },
  { id: "pagina", nome: "Primeira página", desc: "Escreveu um exercício", icone: "pen", ok: () => exEscritos() >= 1 },
  { id: "perfil", nome: "Perfil revelado", desc: "Fez o teste dos animais", icone: "user", ok: () => testeOk() },
  { id: "carta", nome: "Carta do dia", desc: "Tirou sua primeira carta", icone: "spark", ok: () => !!S.carta },
  { id: "cem", nome: "100 palavras", desc: "Escreveu 100 palavras", icone: "book", ok: () => totalPalavras() >= 100 },
  { id: "fase-despertar", nome: "Despertar", desc: "Concluiu a fase 1", letra: "D", ok: () => !!S.fases.despertar },
  { id: "fase-entender", nome: "Entender", desc: "Concluiu a fase 2", letra: "E", ok: () => !!S.fases.entender },
  { id: "fase-empoderar", nome: "Empoderar", desc: "Concluiu a fase 3", letra: "E", ok: () => !!S.fases.empoderar },
  { id: "fase-potencializar", nome: "Potencializar", desc: "Concluiu a fase 4", letra: "P", ok: () => !!S.fases.potencializar },
  { id: "mil", nome: "Mil palavras", desc: "Sua história ganhou corpo", icone: "read", ok: () => totalPalavras() >= 1000 },
  { id: "luzes", nome: "50 luzes", desc: "Acendeu 50 luzes", icone: "heart", ok: () => S.luzes >= 50 }
];

/** Conquistas obtidas agora e ainda não registradas. */
export const novasConquistas = () => CONQUISTAS.filter((c) => c.ok() && !(S.medalhas || []).includes(c.id));
