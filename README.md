# DEEP — Um mergulho no autoconhecimento

Mini app (PWA) baseado no e-book **DEEP**, de Ita Batista. A pessoa:

- passa pelas quatro fases do método: Despertar, Entender, Empoderar e Potencializar;
- escreve os exercícios do livro num diário;
- faz o teste de perfil comportamental, que revela Águia, Gato, Tubarão ou Lobo.

Feito com **React 18 + Vite 6**. Pode ser instalado na tela inicial do celular e funciona offline.

## Rodar

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # gera a versão final em dist/
npm run preview   # testa o build em http://localhost:4173
```

## Publicar na Vercel

1. Importe o repositório.
2. O `vercel.json` já define tudo: framework Vite, `npm run build` e a saída em `dist`.

## Estrutura

```
public/img/            ilustrações do e-book, logo e ícones
src/
  main.jsx             ponto de entrada
  App.jsx              casca do app: fundo, telas, abas, modal e toast
  styles.css           todo o visual (cores, tipografia, animações)
  data/
    perfis.js          Águia, Gato, Tubarão e Lobo (textos do livro)
    perguntas.js       as 25 perguntas do teste
    jornada.jsx        fases, exercícios, leituras, pensamentos e contatos
  lib/
    store.js           progresso salvo no aparelho (localStorage)
    regras.js          cálculo do perfil e desbloqueio de fases e passos
    nav.js             pilha de telas + botão "voltar" do aparelho
    ui.jsx             toast, modal, cena de fundo e efeitos
    acoes.jsx          luzes, comemoração de fase, PDF e refazer o teste
  components/          Oceano (fundo animado), Radar, Icon e barras
  screens/             Inicio, Jornada, Fase, Teste, Perfil, Diario e Ita
```

## Regras do teste

Cada uma das 25 perguntas tem uma única escolha, e cada escolha corresponde a uma letra:

| Letra | Perfil |
|---|---|
| I | Águia |
| C | Gato |
| A | Tubarão |
| O | Lobo |

O resultado de cada perfil é o total da sua letra × 4, em porcentagem. Se houver empate no topo, aparecem os dois perfis.

## Para editar

- **Textos e contatos:** ficam em `src/data/`. Não é preciso mexer nas telas.
- **Cores e fontes:** use as variáveis em `:root`, no começo de `src/styles.css`.

## Dados

As respostas ficam só no navegador da pessoa (`localStorage`, chave `deep-ita-batista-v2`). Não há servidor nem coleta de dados.

## Direitos

Textos, ilustrações, nome e marca pertencem a Ita Batista. Não reutilize sem autorização.
