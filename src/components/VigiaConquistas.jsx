import { useEffect, useRef } from "react";
import { useApp, S, persistir } from "../lib/store.js";
import { toast } from "../lib/ui.jsx";
import { novasConquistas } from "../lib/conquistas.js";

/** Observa o progresso e avisa quando uma medalha nova é conquistada. */
export default function VigiaConquistas() {
  useApp();
  const fila = useRef([]);
  const tocando = useRef(false);

  useEffect(() => {
    const novas = novasConquistas();
    if (!novas.length) return;
    S.medalhas = [...(S.medalhas || []), ...novas.map((c) => c.id)];
    persistir();
    // "Primeiro mergulho" é silenciosa: coincide com a mensagem de boas-vindas.
    fila.current.push(...novas.filter((c) => c.id !== "inicio"));
    const proxima = () => {
      const c = fila.current.shift();
      if (!c) { tocando.current = false; return; }
      tocando.current = true;
      toast(`Conquista: ${c.nome}`, "spark");
      setTimeout(proxima, 2900);
    };
    if (!tocando.current) { tocando.current = true; setTimeout(proxima, 2700); }
  });

  return null;
}
