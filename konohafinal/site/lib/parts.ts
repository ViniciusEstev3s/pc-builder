export type Spec = {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  unit: string;
  explain: string;
};

export type Part = {
  id: string;
  index: string;
  name: string;
  short: string;
  analogy: string;
  analogyIcon: string;
  what: string;
  role: string;
  connects: string[];
  specs: Spec[];
  tip: string;
  terms: { term: string; tip: string }[];
};

export const PARTS: Part[] = [
  {
    id: 'cpu',
    index: '01',
    name: 'Processador',
    short: 'CPU',
    analogy: 'O cérebro do computador',
    analogyIcon: '🧠',
    what:
      'A CPU (Central Processing Unit) é um chip do tamanho de um biscoito que executa cada instrução dos programas: abrir uma janela, calcular uma planilha, decidir o que um personagem do jogo faz. Assim como o cérebro, ela não guarda nada por muito tempo — ela pensa e manda.',
    role:
      'Fica encaixada no soquete da placa-mãe. Lê dados da RAM, envia ordens de desenho para a placa de vídeo e conversa com o SSD através da placa-mãe. Como esquenta muito, sempre trabalha com pasta térmica e um cooler por cima.',
    connects: ['Placa-mãe (soquete)', 'Memória RAM', 'Cooler + pasta térmica'],
    specs: [
      { label: 'Núcleos', value: 8, unit: 'núcleos', explain: 'Cada núcleo é um "mini-cérebro". Mais núcleos = mais tarefas ao mesmo tempo (jogar + transmitir + navegador).' },
      { label: 'Frequência', value: 4.5, decimals: 1, unit: 'GHz', explain: 'Quantos bilhões de ciclos por segundo cada núcleo faz. Mais GHz = cada tarefa termina mais rápido.' },
      { label: 'Cache', value: 96, unit: 'MB', explain: 'Uma memória minúscula e ultrarrápida dentro do chip, para o que a CPU usa a toda hora. Cache grande ajuda muito em jogos.' },
      { label: 'TDP', value: 120, unit: 'W', explain: 'Quanto calor o processador gera, em watts. Diz qual cooler você precisa.' },
    ],
    tip:
      'Confira se o soquete combina com a placa-mãe (ex.: AM5 com AM5, LGA1851 com LGA1851). Para jogos, 6 a 8 núcleos bastam; para edição de vídeo, mais núcleos fazem diferença.',
    terms: [
      { term: 'Soquete', tip: 'O "encaixe" na placa-mãe onde a CPU entra. Cada geração tem um formato.' },
      { term: 'Threads', tip: 'Linhas de trabalho. Um núcleo com SMT/Hyper-Threading cuida de 2 threads.' },
    ],
  },
  {
    id: 'mobo',
    index: '02',
    name: 'Placa-mãe',
    short: 'Motherboard',
    analogy: 'A cidade com ruas ligando tudo',
    analogyIcon: '🏙️',
    what:
      'É a grande placa de circuito onde todas as peças se encaixam. Pense numa cidade: os componentes são os prédios e as trilhas de cobre são as ruas por onde passam dados e energia. Sozinha ela não processa nada, mas sem ela ninguém conversa com ninguém.',
    role:
      'Recebe a CPU no soquete, a RAM nos slots DIMM, a placa de vídeo no slot PCIe e o SSD no slot M.2. A fonte liga nela pelo cabo de 24 pinos, e o chipset distribui as conexões de USB, rede e áudio.',
    connects: ['CPU', 'RAM', 'Placa de vídeo (PCIe)', 'SSD (M.2)', 'Fonte (24 pinos)'],
    specs: [
      { label: 'Slots de RAM', value: 4, unit: 'slots', explain: 'Quantos pentes de memória cabem. 4 slots permitem expandir depois.' },
      { label: 'Slots M.2', value: 3, unit: 'slots', explain: 'Encaixes para SSDs pequenos e rápidos, que ficam deitados na placa.' },
      { label: 'Linhas PCIe', value: 5, prefix: 'Gen ', unit: '', explain: 'Geração do "barramento" da placa de vídeo e SSD. Cada geração dobra a velocidade da anterior.' },
      { label: 'Fases VRM', value: 14, unit: 'fases', explain: 'Circuitos que entregam energia limpa à CPU. Mais fases = energia mais estável para processadores fortes.' },
    ],
    tip:
      'Escolha primeiro a CPU, depois a placa com o mesmo soquete. Verifique o tamanho (ATX, Micro-ATX, Mini-ITX) — ele precisa caber no gabinete.',
    terms: [
      { term: 'Chipset', tip: 'O "gerente" da placa-mãe que controla USB, SATA e recursos extras.' },
      { term: 'Form factor', tip: 'O tamanho padrão da placa: ATX (grande), Micro-ATX (média), Mini-ITX (pequena).' },
    ],
  },
  {
    id: 'ram',
    index: '03',
    name: 'Memória RAM',
    short: 'RAM',
    analogy: 'A mesa de trabalho',
    analogyIcon: '🗂️',
    what:
      'A RAM é onde ficam os arquivos que você está usando agora. Imagine uma mesa: o armário (SSD) guarda tudo, mas você só trabalha com o que está em cima da mesa. Quanto maior a mesa, mais coisas abertas ao mesmo tempo sem bagunça. Ao desligar o PC, a mesa é limpa.',
    role:
      'Encaixa nos slots DIMM ao lado da CPU, que a consulta bilhões de vezes por segundo. Quando um jogo abre, os dados saem do SSD, vão para a RAM e daí para a CPU.',
    connects: ['Placa-mãe (slots DIMM)', 'CPU', 'SSD'],
    specs: [
      { label: 'Capacidade', value: 32, unit: 'GB', explain: 'O tamanho da "mesa". 16 GB é o mínimo confortável hoje; 32 GB sobra para jogos e multitarefa.' },
      { label: 'Velocidade', value: 6000, unit: 'MT/s', explain: 'Quantos milhões de transferências por segundo. Mais rápido = CPU espera menos.' },
      { label: 'Latência', value: 30, prefix: 'CL', unit: '', explain: 'O tempo de reação da memória. Aqui, menor é melhor.' },
      { label: 'Canais', value: 2, unit: 'pentes', explain: 'Usar 2 pentes iguais ativa o "dual channel", que dobra a largura da estrada.' },
    ],
    tip:
      'Compre em kit de 2 pentes iguais (ex.: 2×16 GB) e confira se a placa-mãe aceita DDR4 ou DDR5 — elas não são compatíveis entre si.',
    terms: [
      { term: 'DDR5', tip: 'Geração atual de memória. Não encaixa em placas DDR4.' },
      { term: 'XMP / EXPO', tip: 'Perfil que liga a velocidade anunciada da RAM com um clique na BIOS.' },
    ],
  },
  {
    id: 'gpu',
    index: '04',
    name: 'Placa de vídeo',
    short: 'GPU',
    analogy: 'Um estúdio de pintores trabalhando juntos',
    analogyIcon: '🎨',
    what:
      'A GPU desenha tudo o que aparece na tela. Enquanto a CPU é um gênio que resolve uma conta difícil por vez, a GPU é um estúdio com milhares de pintores, cada um colorindo um pedacinho da imagem ao mesmo tempo — por isso ela é a peça mais importante para jogos.',
    role:
      'Entra no slot PCIe x16 da placa-mãe, recebe pela fonte seus próprios cabos de energia e manda a imagem para o monitor pelas saídas HDMI/DisplayPort. Recebe da CPU a "lista" do que desenhar.',
    connects: ['Placa-mãe (PCIe x16)', 'Fonte (cabo PCIe / 12V-2x6)', 'Monitor'],
    specs: [
      { label: 'VRAM', value: 12, unit: 'GB', explain: 'Memória própria da placa para texturas. Jogos em 1440p pedem ao menos 12 GB.' },
      { label: 'Núcleos', value: 6144, unit: 'shaders', explain: 'Os "pintores". Mais núcleos = mais pixels desenhados por segundo.' },
      { label: 'Consumo', value: 250, unit: 'W', explain: 'Energia que a placa puxa. Define o tamanho da fonte que você precisa.' },
      { label: 'Taxa de quadros', value: 144, unit: 'FPS', explain: 'Imagens por segundo que ela consegue gerar num jogo. Mais FPS = movimento mais suave.' },
    ],
    tip:
      'Veja o comprimento da placa (em mm) e compare com o espaço do gabinete. Defina a resolução do seu monitor antes de escolher — 1080p, 1440p e 4K pedem placas bem diferentes.',
    terms: [
      { term: 'Ray tracing', tip: 'Técnica que simula raios de luz reais para reflexos e sombras.' },
      { term: 'Upscaling', tip: 'DLSS/FSR: o jogo roda numa resolução menor e a IA aumenta a imagem, ganhando FPS.' },
    ],
  },
  {
    id: 'ssd',
    index: '05',
    name: 'SSD',
    short: 'Solid State Drive',
    analogy: 'A gaveta de acesso rápido',
    analogyIcon: '⚡',
    what:
      'O SSD guarda seus arquivos permanentemente — sistema, programas, jogos — e não perde nada ao desligar. Não tem partes móveis: usa chips de memória flash, como um pen drive gigante e veloz. É a gaveta que abre num estalo.',
    role:
      'Os modelos NVMe encaixam direto no slot M.2 da placa-mãe e conversam com a CPU pelas linhas PCIe. É de onde o Windows e os jogos são lidos para a RAM.',
    connects: ['Placa-mãe (M.2)', 'RAM', 'CPU'],
    specs: [
      { label: 'Capacidade', value: 1, unit: 'TB', explain: 'Espaço total. Jogos modernos ocupam 100 GB fácil — 1 TB é um bom começo.' },
      { label: 'Leitura', value: 7000, unit: 'MB/s', explain: 'Velocidade para abrir arquivos. Um HD faz cerca de 150 MB/s.' },
      { label: 'Durabilidade', value: 600, unit: 'TBW', explain: 'Quantos terabytes podem ser gravados antes de desgastar. Para uso doméstico, dura anos.' },
      { label: 'Tempo de acesso', value: 0.1, decimals: 1, unit: 'ms', explain: 'Quanto ele demora para "achar" um arquivo. Praticamente instantâneo.' },
    ],
    tip:
      'Prefira NVMe M.2 para o sistema. Veja se ele tem cache DRAM (mantém a velocidade em cópias grandes) e se a placa-mãe tem slot M.2 livre.',
    terms: [
      { term: 'NVMe', tip: 'Protocolo que faz o SSD usar as linhas PCIe, muito mais rápido que SATA.' },
      { term: 'M.2', tip: 'Formato do SSD em "pente" pequeno que vai direto na placa-mãe.' },
    ],
  },
  {
    id: 'hdd',
    index: '06',
    name: 'HD',
    short: 'Hard Disk Drive',
    analogy: 'O depósito do porão',
    analogyIcon: '📦',
    what:
      'O HD guarda dados num disco magnético que gira, lido por uma agulha num braço mecânico — parecido com um toca-discos. É lento para buscar coisas, mas cabe muito por pouco dinheiro. É o depósito: enorme e barato, mas você precisa descer a escada.',
    role:
      'Liga na placa-mãe por um cabo de dados SATA e recebe energia da fonte por um cabo SATA de força. Ideal para fotos, vídeos e backups, não para o sistema.',
    connects: ['Placa-mãe (SATA dados)', 'Fonte (SATA energia)'],
    specs: [
      { label: 'Capacidade', value: 4, unit: 'TB', explain: 'Muito espaço por pouco preço — ótimo para arquivos grandes.' },
      { label: 'Rotação', value: 7200, unit: 'RPM', explain: 'Voltas do disco por minuto. 7200 é mais rápido que 5400.' },
      { label: 'Leitura', value: 180, unit: 'MB/s', explain: 'Cerca de 40× mais lento que um bom SSD NVMe.' },
      { label: 'Tempo de acesso', value: 9, unit: 'ms', explain: 'O braço precisa se mover até o dado: cerca de 90× mais lento que o SSD.' },
    ],
    tip:
      'Use HD como segundo armazenamento. Para guardar backups, prefira modelos CMR (gravam de forma mais consistente que SMR).',
    terms: [
      { term: 'RPM', tip: 'Rotações por minuto do disco magnético.' },
      { term: 'SATA', tip: 'Conexão mais antiga e lenta (até ~600 MB/s), usada por HDs e SSDs de 2,5".' },
    ],
  },
  {
    id: 'psu',
    index: '07',
    name: 'Fonte',
    short: 'PSU',
    analogy: 'O coração que bombeia energia',
    analogyIcon: '🫀',
    what:
      'A fonte transforma a energia da tomada (corrente alternada, 127/220 V) na energia que as peças usam (corrente contínua, 12 V, 5 V e 3,3 V). Como o coração, ela distribui "sangue" para o corpo inteiro — e uma fonte ruim pode danificar todas as outras peças.',
    role:
      'Fica geralmente na parte de baixo do gabinete. Manda cabos para a placa-mãe (24 pinos), para a CPU (8 pinos), para a placa de vídeo e para HDs/SSDs SATA.',
    connects: ['Placa-mãe', 'CPU (EPS 8 pinos)', 'Placa de vídeo', 'HD/SSD SATA'],
    specs: [
      { label: 'Potência', value: 750, unit: 'W', explain: 'Energia máxima que ela entrega. Some o consumo da CPU + GPU e deixe ~30% de folga.' },
      { label: 'Eficiência', value: 90, unit: '%', explain: 'Quanto da energia da tomada vira energia útil. O resto vira calor.' },
      { label: 'Certificação', value: 80, prefix: '', unit: 'Plus Gold', explain: 'Selo de eficiência: Bronze < Silver < Gold < Platinum < Titanium.' },
      { label: 'Garantia', value: 10, unit: 'anos', explain: 'Garantia longa costuma indicar componentes de qualidade.' },
    ],
    tip:
      'Nunca economize na fonte. Prefira marcas reconhecidas, 80 Plus Bronze ou melhor e modelo modular (você só conecta os cabos que usa, organização mais limpa).',
    terms: [
      { term: '80 Plus', tip: 'Certificação que garante eficiência mínima de 80% ou mais.' },
      { term: 'Modular', tip: 'Fonte com cabos destacáveis — menos cabos sobrando no gabinete.' },
    ],
  },
  {
    id: 'aio',
    index: '08',
    name: 'Water cooler',
    short: 'AIO',
    analogy: 'O radiador de um carro',
    analogyIcon: '💧',
    what:
      'O water cooler resfria a CPU com líquido. Uma bomba sobre o processador faz o líquido absorver o calor, que viaja por mangueiras até um radiador; ali, fans sopram ar e jogam o calor para fora. É o mesmo princípio do radiador de um carro.',
    role:
      'O bloco com a bomba fica sobre a CPU (com pasta térmica entre eles). O radiador é parafusado no topo ou na frente do gabinete, e as fans do radiador ligam nos conectores da placa-mãe.',
    connects: ['CPU (bloco + bomba)', 'Gabinete (radiador)', 'Placa-mãe (bomba e fans)'],
    specs: [
      { label: 'Radiador', value: 360, unit: 'mm', explain: 'Tamanho do radiador. 240 mm para CPUs médias, 360 mm para as mais quentes.' },
      { label: 'Fans', value: 3, unit: '× 120 mm', explain: 'Quantas ventoinhas empurram ar pelo radiador.' },
      { label: 'Bomba', value: 2800, unit: 'RPM', explain: 'Velocidade da bomba que faz o líquido circular.' },
      { label: 'Ruído', value: 28, unit: 'dB', explain: 'Barulho máximo. Até 30 dB é praticamente um sussurro.' },
    ],
    tip:
      'Confira se o gabinete tem espaço para o radiador (240/280/360 mm) no topo ou na frente. Água é estética e eficiente, mas a bomba pode falhar com os anos.',
    terms: [
      { term: 'AIO', tip: '"All-in-one": water cooler selado de fábrica, sem manutenção.' },
      { term: 'Bomba', tip: 'Motor que circula o líquido. Se parar, a CPU superaquece.' },
    ],
  },
  {
    id: 'air',
    index: '09',
    name: 'Air cooler',
    short: 'Cooler a ar',
    analogy: 'O ventilador com aletas de um ar-condicionado',
    analogyIcon: '🌬️',
    what:
      'O air cooler tira o calor da CPU com metal e vento. Tubos de cobre (heatpipes) levam o calor até uma torre de aletas de alumínio, e uma fan sopra ar por elas. Simples, silencioso e quase indestrutível.',
    role:
      'É parafusado sobre a CPU com pasta térmica no meio. A fan liga no conector CPU_FAN da placa-mãe, que ajusta a velocidade conforme a temperatura.',
    connects: ['CPU', 'Placa-mãe (CPU_FAN)'],
    specs: [
      { label: 'Heatpipes', value: 6, unit: 'tubos', explain: 'Tubos de cobre que "transportam" calor. Mais tubos = mais calor removido.' },
      { label: 'Altura', value: 158, unit: 'mm', explain: 'Torres altas podem não caber em gabinetes estreitos. Sempre confira.' },
      { label: 'Suporta', value: 220, unit: 'W TDP', explain: 'Quanto calor ele aguenta dissipar sem a CPU esquentar demais.' },
      { label: 'Ruído', value: 25, unit: 'dB', explain: 'Bons air coolers são tão silenciosos quanto water coolers.' },
    ],
    tip:
      'Compare a altura do cooler com a "altura máxima de cooler" do gabinete. Para a maioria das pessoas, um bom air cooler entrega o mesmo resultado que um water cooler, por menos.',
    terms: [
      { term: 'Heatpipe', tip: 'Tubo com fluido interno que evapora no calor e condensa no frio, movendo energia rapidamente.' },
      { term: 'Aletas', tip: 'Lâminas finas de alumínio que aumentam a área de troca de calor com o ar.' },
    ],
  },
  {
    id: 'fans',
    index: '10',
    name: 'Fans',
    short: 'Ventoinhas',
    analogy: 'Os pulmões do gabinete',
    analogyIcon: '🌀',
    what:
      'Fans são ventiladores que criam um caminho de ar dentro do gabinete: puxam ar frio pela frente e empurram o ar quente para fora por trás e pelo topo. É a respiração do PC — inspira ar fresco, expira calor.',
    role:
      'Ficam presas ao gabinete e ligam na placa-mãe (conectores de 4 pinos PWM, que controlam a velocidade) e, quando têm RGB, nos conectores ARGB de 5 V.',
    connects: ['Gabinete', 'Placa-mãe (PWM e ARGB)'],
    specs: [
      { label: 'Tamanho', value: 120, unit: 'mm', explain: '120 mm e 140 mm são os padrões. Maiores giram mais devagar e fazem menos barulho.' },
      { label: 'Fluxo de ar', value: 65, unit: 'CFM', explain: 'Volume de ar que a fan move. Bom para a entrada do gabinete.' },
      { label: 'Pressão estática', value: 2.5, decimals: 1, unit: 'mmH₂O', explain: 'Força para empurrar ar através de obstáculos, como radiadores.' },
      { label: 'Velocidade', value: 1800, unit: 'RPM', explain: 'Rotação máxima. O controle PWM reduz quando o PC está frio.' },
    ],
    tip:
      'Monte mais fans puxando ar para dentro do que para fora (pressão positiva) — isso reduz poeira. Prefira fans PWM de 4 pinos.',
    terms: [
      { term: 'PWM', tip: 'Controle de velocidade por pulsos. A placa-mãe acelera a fan só quando precisa.' },
      { term: 'CFM', tip: 'Pés cúbicos por minuto — o volume de ar movido.' },
    ],
  },
  {
    id: 'paste',
    index: '11',
    name: 'Pasta térmica',
    short: 'Thermal paste',
    analogy: 'O hidratante entre duas superfícies',
    analogyIcon: '🧴',
    what:
      'Por mais lisos que pareçam, o topo da CPU e a base do cooler têm microrranhuras cheias de ar — e ar é péssimo condutor de calor. A pasta térmica preenche esses buraquinhos, criando uma ponte perfeita para o calor passar.',
    role:
      'Uma camada fina, do tamanho de um grão de ervilha, vai entre a CPU e o cooler (a ar ou a água). Muitos coolers já vêm com pasta aplicada.',
    connects: ['CPU', 'Cooler (base)'],
    specs: [
      { label: 'Condutividade', value: 12.5, decimals: 1, unit: 'W/m·K', explain: 'Facilidade com que o calor atravessa a pasta. Maior = melhor.' },
      { label: 'Quantidade', value: 4, unit: 'mm', explain: 'Uma gota do tamanho de uma ervilha é suficiente. O excesso não ajuda.' },
      { label: 'Ganho', value: 15, unit: '°C', explain: 'Diferença típica entre aplicar pasta e não aplicar nada.' },
      { label: 'Reaplicar', value: 3, unit: 'anos', explain: 'A pasta seca com o tempo; troque quando as temperaturas subirem.' },
    ],
    tip:
      'Escolha pasta não condutiva de eletricidade (as comuns de silicone/cerâmica). Metal líquido rende mais, mas é condutivo e arriscado para iniciantes.',
    terms: [
      { term: 'W/m·K', tip: 'Unidade de condutividade térmica: quanto calor passa pelo material.' },
      { term: 'IHS', tip: 'A "tampa" metálica da CPU, onde a pasta é aplicada.' },
    ],
  },
  {
    id: 'case',
    index: '12',
    name: 'Gabinete',
    short: 'Case',
    analogy: 'A casa que abriga a família',
    analogyIcon: '🏠',
    what:
      'O gabinete é a casa do computador: protege as peças da poeira e de pancadas, organiza os cabos e direciona o vento. A lateral de vidro temperado deixa a montagem e o RGB à mostra.',
    role:
      'Tudo é parafusado nele: placa-mãe nos espaçadores, fonte embaixo, radiador no topo, fans na frente. Os botões e as portas USB frontais ligam na placa-mãe por cabos internos.',
    connects: ['Todas as peças', 'Painel frontal → Placa-mãe'],
    specs: [
      { label: 'GPU máx.', value: 400, unit: 'mm', explain: 'Comprimento máximo de placa de vídeo que cabe.' },
      { label: 'Cooler máx.', value: 170, unit: 'mm', explain: 'Altura máxima de um air cooler.' },
      { label: 'Fans', value: 10, unit: 'posições', explain: 'Quantas ventoinhas podem ser instaladas.' },
      { label: 'Radiador', value: 360, unit: 'mm', explain: 'Maior radiador de water cooler suportado no topo/frente.' },
    ],
    tip:
      'Antes de comprar, confira três medidas: comprimento da GPU, altura do cooler e tamanho da placa-mãe. Frente com tela (mesh) respira muito melhor que frente fechada de vidro.',
    terms: [
      { term: 'Mid-tower', tip: 'Tamanho mais comum de gabinete, para placas ATX.' },
      { term: 'Mesh', tip: 'Painel em tela perfurada que deixa o ar passar com facilidade.' },
    ],
  },
];

export const GLOSSARY: { term: string; def: string }[] = [
  { term: '1080p / 1440p', def: 'Resolução da tela: Full HD (1920×1080) e Quad HD (2560×1440). Quanto mais pixels, mais a placa de vídeo trabalha.' },
  { term: 'ATX / Micro-ATX', def: 'Tamanhos de placa-mãe. ATX é a grande; Micro-ATX, a média. O gabinete precisa aceitar o tamanho escolhido.' },
  { term: 'BIOS / UEFI', def: 'Programa gravado na placa-mãe que liga o PC e permite ajustar configurações antes do Windows.' },
  { term: 'Bottleneck (gargalo)', def: 'Quando uma peça fraca segura o desempenho de outra forte — ex.: CPU antiga com GPU top.' },
  { term: 'Clock / GHz', def: 'Ritmo de trabalho de um chip, em bilhões de ciclos por segundo.' },
  { term: 'DDR4 / DDR5', def: 'Gerações de memória RAM. Não são compatíveis entre si.' },
  { term: 'Dual Channel', def: 'Dois pentes de memória trabalhando juntos. Dobra a "largura da estrada" entre RAM e CPU; por isso 2×8 GB é melhor que 1×16 GB.' },
  { term: 'FPS', def: 'Quadros por segundo. Quantas imagens a GPU entrega ao monitor a cada segundo.' },
  { term: 'iGPU (vídeo integrado)', def: 'Placa de vídeo simples embutida no processador. Basta para estudo e escritório; para jogos pesados, use uma placa de vídeo dedicada.' },
  { term: 'NVMe', def: 'Tipo de SSD que conversa com a CPU pela via expressa PCIe.' },
  { term: 'Overclock', def: 'Fazer uma peça trabalhar acima da velocidade de fábrica. Gera mais calor.' },
  { term: 'PCIe', def: 'A "rodovia" de alta velocidade que liga GPU e SSDs à CPU.' },
  { term: 'RGB / ARGB', def: 'Iluminação colorida. ARGB permite cores diferentes em cada LED.' },
  { term: 'SATA', def: 'Conexão mais antiga para SSDs de 2,5" e HDs. Funciona bem, mas é várias vezes mais lenta que NVMe.' },
  { term: 'Soquete', def: 'O encaixe da CPU na placa-mãe. Precisa ser compatível.' },
  { term: 'TDP', def: 'Calor que uma peça produz, em watts — usado para escolher o cooler.' },
  { term: 'Thermal throttling', def: 'Quando a peça esquenta demais e se desacelera sozinha para se proteger.' },
  { term: 'VRAM', def: 'Memória exclusiva da placa de vídeo, usada para texturas e imagens.' },
  { term: 'VRM', def: 'Circuito da placa-mãe que regula a energia entregue à CPU.' },
  { term: 'Watts (W)', def: 'Medida de energia. Diz quanto uma peça consome ou quanto uma fonte entrega.' },
  { term: '80 Plus', def: 'Selo de eficiência das fontes: Bronze, Silver, Gold, Platinum, Titanium.' },
];
