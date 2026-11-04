/** Conteúdo de apoio: escolha pronto × montado, FAQ, artigos e atalhos. */

export const CHOICE = [
  {
    id: 'pronto',
    title: 'PC pronto',
    sub: 'pré-montado',
    lead: 'Chega montado, testado e com o sistema instalado. Você tira da caixa, liga na tomada e usa.',
    pros: ['Uma garantia só, para o conjunto inteiro', 'Zero risco de errar na montagem', 'Suporte concentrado em uma empresa'],
    cons: ['Pouca escolha da marca de cada peça', 'Alguns modelos economizam na fonte ou na placa-mãe', 'Upgrade pode ser limitado em PCs de marca'],
    ideal: 'Quem quer praticidade e não pretende abrir o gabinete.',
  },
  {
    id: 'montar',
    title: 'Montar você mesmo',
    sub: 'peça por peça',
    lead: 'Você escolhe cada componente, compra separado e monta. Dá trabalho uma tarde, e você entende cada parafuso.',
    pros: ['Escolhe exatamente cada peça', 'Investe onde importa (ex.: placa de vídeo)', 'Upgrade fácil: troca só o que precisa'],
    cons: ['Precisa checar a compatibilidade entre as peças', 'Garantia separada para cada componente', 'Exige cuidado com estática e cabos'],
    ideal: 'Quem quer controle, custo-benefício e aprender no processo.',
  },
];

export const CHOICE_QUIZ = [
  { q: 'Você se sente à vontade para abrir o gabinete e encaixar peças?', montar: 'sim' },
  { q: 'Quer escolher a marca e o modelo de cada componente?', montar: 'sim' },
  { q: 'Prefere resolver qualquer problema com uma única garantia?', montar: 'não' },
] as const;


export const FAQ = [
  {
    q: 'Preciso entender de eletrônica para montar um PC?',
    a: 'Não. Montar um PC é encaixar peças em lugares que só aceitam o encaixe certo, como um LEGO caro. O cuidado principal é descarregar a eletricidade estática do corpo (tocando no gabinete de metal) e seguir o manual da placa-mãe.',
  },
  {
    q: 'Quais peças são obrigatórias para o PC ligar?',
    a: 'Processador, placa-mãe, memória RAM, armazenamento (SSD ou HD), fonte e um cooler para a CPU. A placa de vídeo só é dispensável se o processador tiver vídeo integrado. Gabinete e fans extras são altamente recomendados, mas o PC liga sem eles.',
  },
  {
    q: 'Montar sai mais barato que comprar pronto?',
    a: 'Na maioria das vezes, sim, principalmente porque você escolhe onde gastar. Mas promoções de PCs prontos às vezes empatam. Compare o preço total do pronto com a soma das mesmas peças avulsas, sem esquecer o sistema operacional.',
  },
  {
    q: 'Como sei se as peças são compatíveis entre si?',
    a: 'Use o Montar PC: ele só mostra as peças que encaixam no que você já escolheu e explica o motivo das que ficaram de fora. Se as peças são de outra loja, a aba "Conferir minhas peças" checa soquete, memória, espaço no gabinete e fonte a partir das fichas técnicas.',
  },
  {
    q: 'Quantos watts de fonte eu preciso?',
    a: 'Some o consumo (TDP) do processador e da placa de vídeo, acrescente cerca de 100 W para o resto e deixe uns 30% de folga. Um PC com CPU de 120 W e GPU de 250 W fica confortável com uma fonte de 650 a 750 W.',
  },
  {
    q: 'Water cooler pode vazar e estragar o PC?',
    a: 'É raro. Os modelos AIO vêm selados de fábrica e testados. O desgaste mais comum é a bomba parar depois de alguns anos, e por isso vale ficar de olho na temperatura da CPU.',
  },
  {
    q: 'Posso aproveitar peças do meu PC antigo?',
    a: 'Algumas, sim: gabinete, fonte (se for boa e tiver potência), HDs, SSDs SATA e periféricos costumam ser reaproveitados. Processador, placa-mãe e memória geralmente mudam juntos, porque dependem do mesmo soquete e da mesma geração de RAM.',
  },
];

export const FAQ_EXTRA = [
  {
    q: 'Os preços do site são atualizados?',
    a: 'São preços de referência cadastrados no catálogo do projeto, para comparar opções e montar um orçamento. Antes de comprar, confira o valor na loja.',
  },
  {
    q: 'O FPS mostrado no resultado é garantido?',
    a: 'Não. São estimativas a partir de testes publicados para cada placa de vídeo, ajustadas pelo processador e pela memória. Drivers, configurações e o próprio jogo mudam o número real.',
  },
];

export const ARTICLES = [
  {
    id: 'checklist',
    tag: 'Montagem',
    title: 'Antes de comprar: 7 checagens de compatibilidade',
    blurb: 'O que conferir no carrinho para nenhuma peça ficar encostada.',
    read: '4 min',
    body: [
      'A maior frustração de quem monta o primeiro PC não é a montagem em si: é descobrir, com tudo na mesa, que duas peças não conversam. Estas sete checagens resolvem quase todos os casos.',
    ],
    list: [
      'Soquete: o processador e a placa-mãe precisam usar o mesmo (ex.: AM5 com AM5).',
      'Memória: DDR4 e DDR5 têm encaixes diferentes. Veja qual a placa-mãe aceita.',
      'Tamanho da placa-mãe: ATX, Micro-ATX ou Mini-ITX precisa caber no gabinete.',
      'Comprimento da GPU: compare os milímetros da placa com o limite do gabinete.',
      'Altura do cooler: torres de ar altas não cabem em gabinetes estreitos.',
      'Radiador: se for water cooler, confira se o topo ou a frente aceita 240/280/360 mm.',
      'Fonte: potência com folga e os cabos certos para a placa de vídeo.',
    ],
  },
  {
    id: 'perifericos',
    tag: 'Setup',
    title: 'Periféricos: onde vale a pena gastar',
    blurb: 'Monitor, teclado e mouse mudam mais a experiência do que parece.',
    read: '3 min',
    body: [
      'Não adianta a placa de vídeo gerar 144 quadros por segundo se o monitor só mostra 60. O monitor é o periférico que mais muda o que você vê, e deve combinar com a GPU.',
      'Teclado e mouse são o que você toca o dia inteiro. Um mouse com sensor preciso e um teclado confortável fazem mais diferença no uso diário do que alguns FPS a mais.',
    ],
    list: [
      'Monitor: combine a resolução (1080p, 1440p, 4K) e a taxa de atualização (Hz) com a GPU.',
      'Mouse: formato que encaixa na sua mão vale mais que o DPI máximo.',
      'Teclado: mecânico dura mais e tem resposta firme; membrana é mais silencioso e barato.',
      'Headset: em jogos, um bom áudio ajuda a localizar passos e tiros.',
    ],
  },
  {
    id: 'manutencao',
    tag: 'Cuidados',
    title: 'Manutenção: poeira, pasta térmica e temperatura',
    blurb: 'Três hábitos simples que fazem o PC durar anos.',
    read: '3 min',
    body: [
      'Calor é o principal inimigo do hardware. Quando as peças esquentam demais, elas se desaceleram sozinhas para se proteger (thermal throttling), e o PC fica mais lento sem você saber por quê.',
    ],
    list: [
      'Poeira: limpe filtros e fans a cada 3 a 6 meses com ar comprimido ou pincel macio.',
      'Pasta térmica: troque a cada 2 a 3 anos ou quando a temperatura da CPU subir sem motivo.',
      'Temperatura: em jogo, até ~80 °C na CPU e na GPU é normal. Acima disso, investigue.',
      'Cabos: organizados atrás da placa-mãe, eles deixam o ar circular livremente.',
    ],
  },
];

export const SHORTCUTS: [string, string][] = [
  ['/', 'Buscar uma peça ou um termo'],
  ['?', 'Abrir ou fechar a ajuda'],
  ['Esc', 'Fechar menus, janelas e ajuda'],
  ['Alt + 1…6', 'Ir para uma seção do menu'],
  ['→ ou ←', 'Próxima ou anterior peça (em Aprender)'],
  ['A–D, Enter', 'Responder e avançar no quiz'],
];

/* abre o painel "Como usar" a partir de qualquer link com href="#como-usar" */
export const OPEN_HELP = 'open-help';
