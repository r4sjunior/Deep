// Exercícios de escrita, leituras e as quatro fases do Método DEEP.

export const EX = {
  ex1: {
    n: 1, titulo: "O Primeiro Encontro com Você", img: "img/ex1.jpg", min: 8,
    intro: [
      "Talvez essa seja uma das primeiras vezes em que você realmente irá parar para se observar com mais profundidade, sem máscaras, sem personagens e sem a necessidade de corresponder às expectativas dos outros.",
      "Aqui não existe certo ou errado. Existe apenas a sua percepção sobre quem você é hoje. Então respire fundo… e simplesmente escreva."
    ],
    campos: [["quem", "Quem é você?"], ["visao", "Qual a visão que você tem de si mesmo?"], ["processo", "Como você se vê nesse processo do despertar?"], ["dificuldade", "Qual a maior dificuldade que você percebe em você hoje?"], ["antes", "Como você estava há um ano atrás?"], ["agora", "E como você está agora?"]]
  },
  ex3: {
    n: 3, titulo: "O Que Existe Aí Dentro?", img: "img/ex3.jpg", min: 6,
    intro: [
      "Feche os olhos por alguns instantes e traga à tona aquilo que mais te incomodou nos exercícios anteriores. Em qual momento você sentiu desconforto? O que mexeu com você? O que despertou emoções que talvez estivessem guardadas há muito tempo?",
      "Escreva sobre o que você está sentindo. Sem julgamentos. Sem críticas. Sem a preocupação de escrever bonito. Aqui, você não precisa impressionar ninguém."
    ],
    campos: [["sentir", "O que estou sentindo"]]
  },
  ex4: {
    n: 4, titulo: "O Que Pode Ser Transformado?", img: "img/ex4.jpg", min: 6,
    intro: [
      "O que você percebe que precisa mudar? Quais comportamentos, pensamentos ou emoções você identifica que já não fazem mais sentido carregar?",
      "Esse exercício não é sobre cobrança. É sobre consciência."
    ],
    campos: [["mudar", "O que eu percebo que precisa mudar"], ["soltar", "O que já não faz sentido carregar"]]
  },
  ex5: {
    n: 5, titulo: "Reconhecendo Sua Potência", img: "img/potencia.jpg", min: 6,
    intro: [
      "Dom é aquilo que já nasceu com você. É algo natural, que faz parte da sua essência. Talento é aquilo que foi desenvolvido ao longo da sua caminhada, através das experiências, aprendizados e vivências da vida.",
      "Não minimize suas capacidades. Não se diminua. Não esconda sua luz."
    ],
    campos: [["dons", "Meus dons"], ["talentos", "Meus talentos"]]
  },
  ex6: {
    n: 6, titulo: "Percebendo Sua Transformação", img: "img/transformacao.jpg", min: 6,
    intro: [
      "O que você descobriu sobre si mesmo? Quais percepções surgiram ao longo dos exercícios? O quanto você passou a se observar mais?",
      "Aqui não é momento de cobrança. É momento de reconhecimento."
    ],
    campos: [["percebi", "Como eu me vejo agora, depois dessa caminhada"]]
  },
  ex7: {
    n: 7, titulo: "A História de Quem Você Está Se Tornando", img: "img/historia.jpg", min: 12,
    intro: [
      "Este exercício será uma autobiografia resumida da sua vida, das suas emoções, aprendizados, percepções e anseios.",
      "Escreva sobre quem você foi. Sobre quem você acredita estar se tornando. Sobre suas dores, suas descobertas, seus sonhos e sobre aquilo que deseja viver daqui para frente. Sem limitações, sem medo e, o mais importante, sem pressa."
    ],
    campos: [["historia", "Minha história"]]
  }
};

export const LEITURAS = {
  dor: {
    titulo: "A dor também tem uma função", img: "img/entender.jpg", min: 3,
    corpo: (
      <>
        <p>Muitas vezes, você não é exatamente aquilo que está vivendo hoje. Na maioria das vezes, estamos usando máscaras emocionais para nos proteger da vida, das dores, das rejeições e das experiências que fomos acumulando ao longo da caminhada.</p>
        <p>E sem perceber, acabamos vivendo no automático. Nos moldando ao que disseram sobre nós. Ao que esperavam de nós.</p>
        <p>Mas quando começamos a olhar para esse processo com verdade, entendemos que a dor também tem uma função importante: <b>ela revela aquilo que precisa ser curado.</b></p>
        <div className="quote" style={{ margin: "18px 0 6px" }}>Não é a experiência vivida que nos transforma, mas sim a dor que carregamos dela.</div>
        <p className="sub" style={{ fontSize: 14, paddingLeft: 18 }}>— Lise Bourbeau, <i>As 5 Feridas Emocionais</i></p>
        <p>Por isso, permita-se olhar para dentro com honestidade. Sem fugir. Sem maquiar. Sem racionalizar tudo. Porque a cura acontece quando paramos de fugir de nós mesmos.</p>
        <p>É justamente nessa fase que a autossabotagem, a negação e até a famosa “Síndrome de Gabriela” se fortalecem.</p>
      </>
    )
  },
  avanco: {
    titulo: "Reconheça o quanto já avançou", img: "img/empoderar.jpg", min: 2,
    corpo: (
      <>
        <p>Muitas vezes estamos tão focados no que ainda falta melhorar que esquecemos de perceber o quanto já avançamos.</p>
        <p>Quando começamos a despertar de verdade, também percebemos o quanto ainda nos autossabotamos. Quantas crenças ainda carregamos. Quantos medos ainda nos limitam. <b>E tudo bem.</b> Isso também faz parte da caminhada.</p>
        <div className="quote" style={{ margin: "18px 0" }}>O autoconhecimento não é uma linha reta, ele tem muitas curvas e surpresas, mas este é o processo.</div>
        <p>Este material pode se transformar em um verdadeiro manual de apoio: um recurso ao qual você poderá recorrer sempre que sentir necessidade de reorganizar pensamentos, emoções e sentimentos.</p>
      </>
    )
  },
  fim: {
    titulo: "Uma mensagem especial para você", img: "img/capa.jpg", min: 2,
    corpo: (
      <>
        <p>Você chegou às últimas páginas, mas espero que as reflexões que começaram aqui continuem com você.</p>
        <p>Talvez você tenha iniciado esta jornada procurando respostas. Espero que tenha encontrado também algo igualmente valioso: novas perguntas e uma nova forma de olhar para si.</p>
        <p>Não tenha pressa para compreender tudo agora. Algumas respostas precisam de tempo, e cada nova fase pode revelar algo diferente sobre nós mesmas.</p>
        <p>Volte a estas páginas sempre que sentir necessidade. Continue se escutando, se percebendo e fazendo escolhas mais conscientes.</p>
        <div className="quote" style={{ margin: "18px 0" }}>Você não precisa ter todas as respostas para dar o próximo passo.</div>
        <p className="sign" style={{ fontSize: 34, color: "var(--plum)" }}>Com carinho, Ita Batista</p>
      </>
    )
  }
};

export const FASES = [
  {
    id: "despertar", letra: "D", nome: "Despertar", titulo: "O Despertar", img: "img/despertar.jpg", prof: "Superfície",
    resumo: "O primeiro encontro com você e o seu perfil comportamental.",
    lead: "Essa é a primeira fase desse game. É o caminho que se aprende… caminhando.",
    texto: [
      "E sim, ele é difícil. Mas também é transformador. Porque quando você começa a dedicar tempo de qualidade para si mesmo, se permitindo olhar para sua história com verdade e amorosidade, o processo se torna mais leve.",
      "É no despertar que criamos força para dar mais um passo."
    ],
    citacao: "O questionamento é um dos primeiros passos do despertar.",
    passos: [{ k: "ex1", t: "ex" }, { k: "teste", t: "teste" }]
  },
  {
    id: "entender", letra: "E", nome: "Entender", titulo: "O Entender", img: "img/entender.jpg", prof: "25 metros",
    resumo: "O que existe aí dentro — e o que pode ser transformado.",
    lead: "Essa é a fase em que começamos a enxergar as verdades sendo desmascaradas.",
    texto: [
      "É aqui que entendemos o quanto o ego, muitas vezes, nos afoga em nós mesmos e nos faz sair do caminho da nossa essência.",
      "E talvez a maior tarefa dessa fase seja aprender a se acolher. Se acolher sem culpa. Sem julgamento. Sem violência consigo mesmo."
    ],
    citacao: "Quanto mais eu me conheço, mais verdadeiro eu me torno.",
    passos: [{ k: "ex3", t: "ex" }, { k: "ex4", t: "ex" }, { k: "dor", t: "ler" }]
  },
  {
    id: "empoderar", letra: "E", nome: "Empoderar", titulo: "O Empoderar", img: "img/empoderar.jpg", prof: "50 metros",
    resumo: "Reconhecer sua potência e perceber sua transformação.",
    lead: "Como a própria palavra já diz: empoderar é tomar o seu poder de volta.",
    texto: [
      "Significa assumir as rédeas da sua própria vida. Assumir a responsabilidade pela forma como você escolhe viver, sentir, agir e caminhar daqui para frente.",
      "Essa é a fase em que muitas verdades remexem dentro de nós. Mas também é aqui que damos saltos significativos de crescimento."
    ],
    citacao: "O objetivo deste material não é trazer perfeição. É trazer consciência.",
    passos: [{ k: "ex5", t: "ex" }, { k: "ex6", t: "ex" }, { k: "avanco", t: "ler" }]
  },
  {
    id: "potencializar", letra: "P", nome: "Potencializar", titulo: "Potencializar", img: "img/historia.jpg", prof: "O profundo",
    resumo: "A história de quem você está se tornando.",
    lead: "Esse é o momento de exercitar o DEEP! O profundo que habita dentro de você.",
    texto: [
      "Permita-se voltar mentalmente ao momento em que começou a escrever sobre si mesmo… e perceba o quanto já caminhou até aqui.",
      "Talvez, ao longo dessa escrita, você perceba que existe muito mais força, consciência e verdade aí dentro do que imaginava."
    ],
    citacao: "Algumas histórias merecem continuar sendo escritas a cada dia.",
    passos: [{ k: "ex7", t: "ex" }, { k: "fim", t: "ler" }]
  }
];

export const PENSAMENTOS = [
  "Clareza nem sempre chega antes do movimento. Muitas vezes, ela é construída enquanto caminhamos.",
  "O autoconhecimento não é sobre se tornar perfeito. É sobre se tornar consciente!",
  "Algumas respostas só aparecem quando temos coragem de fazer novas perguntas.",
  "O autoconhecimento não acontece de uma vez. Ele acontece em camadas.",
  "Viver deve ser leve. E essa leveza só acontece quando voltamos para nossa essência.",
  "Você não precisa ter todas as respostas para dar o próximo passo.",
  "A cura acontece quando paramos de fugir de nós mesmos."
];

export const CONTATO = {
  whats: "5547999415812",
  whatsLabel: "(47) 99941-5812",
  insta: "ita.batista",
  youtube: "ItaBatista"
};
