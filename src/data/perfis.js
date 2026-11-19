// Os quatro perfis do teste (Exercício 2 do e-book). Textos citados do livro.
export const ORDEM = ["I", "C", "A", "O"];

export const PERFIS = {
  I: {
    nome: "Águia", img: "img/aguia.jpg", th: "img/aguia-t.jpg", cor: "var(--aguia)", hex: "#5b8fb8",
    curto: "Visionária", tags: ["visionária", "intuitiva", "criativa"],
    texto: [
      "Visionário, gosta de voar alto. Tem a inovação como uma característica determinante, pois vê mais longe, seguindo os caminhos que ninguém mais segue. São pessoas que planejam o futuro construindo no presente aquilo que desejam alcançar.",
      "Normalmente são intuitivas e imaginativas, com uma sensibilidade criativa, buscando sempre inovar na forma de atingir os resultados. Aventuram-se por caminhos diferentes do tradicional ou dos quais já percorreram antes.",
      "São pessoas inquietas, a calmaria incomoda-as, optando sempre por mudanças para sair da rotina. A Águia tem uma visão macro da situação, de forma que as minúcias e os pormenores não lhes chamam a atenção. Têm dificuldade em olhar para o aqui e o agora, pois estão sempre a olhar para o futuro. Não têm paciência para detalhes e para as coisas menos importantes. Perdem facilmente o interesse pelas ideias e projetos, pois há sempre algo novo e diferente que os fazem perder o foco e o entusiasmo."
    ],
    potencias: ["Visão de futuro e inovação", "Intuição e imaginação", "Sensibilidade criativa", "Visão macro das situações", "Coragem para caminhos novos"],
    equilibrio: ["Olhar para o aqui e o agora", "Paciência com os detalhes", "Manter o foco até concluir", "Acolher a rotina e a calmaria"],
    pergunta: "Que projeto você começou com entusiasmo e deixou pelo caminho — e o que ele ainda tem a te dizer?"
  },
  C: {
    nome: "Gato", img: "img/gato.jpg", th: "img/gato-t.jpg", cor: "var(--gato)", hex: "#c483a5",
    curto: "Comunicador", tags: ["comunicador", "generoso", "agregador"],
    texto: [
      "São indivíduos que gostam de trabalhar em equipe, andar em grupo, mantendo a harmonia perante a diversidade de perfis. Possuem a capacidade de fazer interação e definir os papéis de cada um num grupo distinto.",
      "Têm facilidade em se relacionar com as diversas áreas do ambiente corporativo. São comunicadores poderosos e com facilidade para assimilar ideias. Os Gatos não costumam falar dos seus problemas, pois não gostam de mostrar fragilidade.",
      "Buscam aceitação social, pois almejam e precisam da admiração e reconhecimento dos demais. São generosos e buscam a igualdade, a felicidade e o bem-estar. O seu foco são as pessoas, pois acreditam na partilha de sentimentos em busca de um mundo melhor. Apesar de bons comunicadores, têm dificuldade na arte da persuasão."
    ],
    potencias: ["Trabalho em equipe e harmonia", "Comunicação poderosa", "Generosidade", "Foco nas pessoas e no bem-estar", "Facilidade de se relacionar"],
    equilibrio: ["Falar dos próprios problemas", "Permitir-se mostrar fragilidade", "Depender menos de aprovação e reconhecimento", "Desenvolver a arte da persuasão"],
    pergunta: "Em que momentos você deixa de mostrar o que sente para continuar sendo aceito?"
  },
  A: {
    nome: "Tubarão", img: "img/tubarao.jpg", th: "img/tubarao-t.jpg", cor: "var(--tubarao)", hex: "#4f9ea3",
    curto: "Executor", tags: ["executor", "dinâmico", "direto"],
    texto: [
      "Pessoas tubarão estão presentes para o que der e vier e deixam claro para o que vieram. Vão atrás do que querem sem perder tempo esperando o “momento mais favorável”.",
      "Têm senso de urgência e querem tudo para ontem, normalmente metendo os pés pelas mãos. Excelentes executores, não perdem tempo para colocar as decisões em prática.",
      "Dinâmicos, adoram estar em ação. São realizadores e multitarefas, tendo dificuldade em delegar. Diretos, não fazem rodeios para mostrar o que desejam."
    ],
    potencias: ["Execução e realização", "Coragem para agir", "Dinamismo", "Clareza do que deseja", "Objetividade e franqueza"],
    equilibrio: ["Desacelerar o senso de urgência", "Evitar “meter os pés pelas mãos”", "Aprender a delegar", "Valorizar o caminho, não só a chegada"],
    pergunta: "O que você perde quando quer tudo para ontem — e quem poderia caminhar com você?"
  },
  O: {
    nome: "Lobo", img: "img/lobo.jpg", th: "img/lobo-t.jpg", cor: "var(--lobo)", hex: "#8f8ab8",
    curto: "Estrategista", tags: ["estrategista", "leal", "organizado"],
    texto: [
      "Os lobos são estrategistas natos, agem com ponderação, normas e processos. São corretos, metódicos, pontuais, equilibrados, éticos e leais. Fazer melhor, para eles, é fazer bem feito.",
      "São conflituosos e têm baixo potencial para insubordinação. Organizados e com planejamento, sabem aonde querem chegar errando o menos possível.",
      "Têm grande dificuldade em se adaptar a mudanças. Adeptos a sistemas, processos, controle, organização e relações sólidas e estruturadas."
    ],
    potencias: ["Estratégia e planejamento", "Ética, lealdade e correção", "Organização e método", "Pontualidade e equilíbrio", "Relações sólidas"],
    equilibrio: ["Abrir-se às mudanças", "Soltar a necessidade de controle", "Flexibilizar regras e processos", "Lidar melhor com os conflitos"],
    pergunta: "Que mudança você vem adiando por medo de perder o controle?"
  }
};
