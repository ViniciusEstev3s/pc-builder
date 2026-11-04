import type { PcPronto } from './tipos';

/**
 * Configurações Pré-Montadas (PCs Gamer e PCs para Trabalho) e Dados da Equipe
 * 
 * Ordenadas rigorosamente do menor valor total para o maior valor total,
 * combinando as peças reais adicionadas ao catálogo.
 */

export const PCS_GAMER: PcPronto[] = [
  {
    id: 'gamer-economico',
    nivel: 'Entrada',
    etiquetaTopo: 'CUSTO-BENEFÍCIO · X99',
    tituloCard: 'Econômico · Kit Xeon X99 & RX 580 8GB',
    nome: 'Konoha Academy — Gamer Econômico 1080p',
    chamadaCurta: 'Porta de entrada acessível com 8 núcleos/16 threads e GPU dedicada de 8GB.',
    perfilUso: 'Indicado para quem busca o menor custo possível para rodar CS2, Valorant, GTA V, Fortnite e jogos populares em Full HD (1080p).',
    imagem: 'img/pecas/reais/gpu-27-rx-580-amd-8gb-gddr5-185w-6-pin.jpg',
    componentesPrincipais: [
      'Intel Xeon E5-2667 v4 · 8C/16T até 3.6GHz',
      'AMD Radeon RX 580 · 8GB GDDR5',
      'Machinist X99-PR9 · LGA 2011-3 Micro-ATX',
      '16GB (2×8GB) Corsair Vengeance DDR4 3200MHz',
      'Kingston A400 480GB SATA III · 500MB/s',
      'MSI MAG A550BN 550W 80 Plus Bronze',
      'Pichau HX300M Glass · Mini Tower',
      'Cooler Master Hyper 212 Black Edition · 150W'
    ],
    pecasIds: {
      cpu: 'cpu-42-xeon-e5-2667-v4',
      placamae: 'mb-34-machinist-x99-pr9',
      ram: 'ram-2-corsair-vengeance-lpx-16gb',
      gpu: 'gpu-27-radeon-rx-580-8gb',
      armazenamento: 'ssd-sata-480gb',
      fonte: 'psu-1-msi-mag-a550bn-550w',
      gabinete: 'case-hx300m',
      cooler: 'cooler-1-cooler-master-hyper-212-black-edition'
    },
    preset3D: {
      corLedHex: '#ff6b00',
      labelNivel: 'Econômico — Kit Xeon X99 + RX 580 8GB + Hyper 212',
      tipoCooler: 'air-tower',
      tamanhoGpu: 'dual-fan'
    }
  },
  {
    id: 'gamer-entrada-intel',
    nivel: 'Entrada',
    etiquetaTopo: 'NÍVEL ENTRADA · INTEL',
    tituloCard: 'Entrada Intel · Core i3 & RTX 3050 6GB',
    nome: 'Konoha Genin Intel — Full HD eSports & DLSS',
    chamadaCurta: 'Plataforma Intel LGA 1700 com GeForce RTX 3050 e suporte a NVIDIA DLSS.',
    perfilUso: 'Excelente eficiência energética para jogos competitivos (Valorant, CS2, LoL, Fortnite) e títulos atuais em 1080p com DLSS.',
    imagem: 'img/pecas/reais/gpu-1-geforce-rtx-3050-nvidia-6gb-gddr6-70w-nenhum.jpg',
    componentesPrincipais: [
      'Intel Core i3-12100F · 4C/8T até 4.3GHz',
      'NVIDIA GeForce RTX 3050 · 6GB GDDR6',
      'ASUS Prime H610M-E D4 · LGA 1700',
      '16GB (2×8GB) Kingston Fury Beast DDR4 3200MHz',
      'Kingston NV2 500GB NVMe · 3500MB/s',
      'MSI MAG A550BN 550W 80 Plus Bronze',
      'Pichau HX300M Glass · Micro-ATX',
      'Cooler Box Padrão · até 65W'
    ],
    pecasIds: {
      cpu: 'cpu-2-intel-core-i3-12100f',
      placamae: 'mb-5-asus-prime-h610m-e-d4',
      ram: 'ram-16gb-ddr4',
      gpu: 'gpu-1-geforce-rtx-3050-6gb',
      armazenamento: 'ssd-nvme-500gb',
      fonte: 'psu-1-msi-mag-a550bn-550w',
      gabinete: 'case-hx300m',
      cooler: 'cooler-box-padrao'
    },
    preset3D: {
      corLedHex: '#ff6b00',
      labelNivel: 'Nível Entrada Intel — Core i3-12100F + RTX 3050 6GB',
      tipoCooler: 'air-compact',
      tamanhoGpu: 'dual-fan'
    }
  },
  {
    id: 'gamer-entrada',
    nivel: 'Entrada',
    etiquetaTopo: 'NÍVEL ENTRADA',
    tituloCard: 'Entrada · Full HD 1080p',
    nome: 'Konoha Genin — Gamer 1080p Full HD',
    chamadaCurta: 'Jogos competitivos e populares em 1080p com alta fluidez.',
    perfilUso: 'Indicado para CS2, Valorant, Fortnite e GTA V em Full HD (1080p) na qualidade Média/Alta.',
    imagem: 'img/pecas/pc-studio-1.webp',
    componentesPrincipais: [
      'AMD Ryzen 5 5600 · 6C/12T até 4.4GHz',
      'AMD Radeon RX 6600 · 8GB GDDR6',
      'MSI A520M-A PRO · AM4',
      '16GB (2×8GB) DDR4 3200MHz Dual Channel',
      'Kingston NV2 500GB NVMe · 3500MB/s',
      'MSI MAG A650BN 650W 80 Plus Bronze',
      'Montech X3 Mesh · Mid Tower 6 Fans',
      'Cooler Box Padrão · até 65W'
    ],
    pecasIds: {
      cpu: 'cpu-r5-5600',
      placamae: 'mb-msi-a520m',
      ram: 'ram-16gb-ddr4',
      gpu: 'gpu-rx6600',
      armazenamento: 'ssd-nvme-500gb',
      fonte: 'psu-msi-650w',
      gabinete: 'case-montech-x3',
      cooler: 'cooler-box-padrao'
    },
    preset3D: {
      corLedHex: '#ff6b00',
      labelNivel: 'Nível Entrada — Mid-Tower Mesh (RX 6600 + Cooler Box)',
      tipoCooler: 'air-compact',
      tamanhoGpu: 'dual-fan'
    }
  },
  {
    id: 'gamer-intermediario',
    nivel: 'Intermediário',
    etiquetaTopo: 'NÍVEL INTERMEDIÁRIO',
    tituloCard: 'Intermediário · 1080p Ultra & DLSS 3',
    nome: 'Konoha Chunin — Gamer Full HD Ultra & DLSS 3',
    chamadaCurta: 'Lançamentos AAA em 1080p Ultra com DLSS 3 e eSports em 240Hz+.',
    perfilUso: 'Ideal para Cyberpunk 2077, Red Dead Redemption 2 e Forza em 1080p Ultra e início em 1440p.',
    imagem: 'img/pecas/pc-studio-2.webp',
    componentesPrincipais: [
      'AMD Ryzen 5 5600 · 6C/12T até 4.4GHz',
      'NVIDIA GeForce RTX 4060 · 8GB GDDR6',
      'ASUS TUF Gaming B550M-Plus · PCIe 4.0',
      '16GB (2×8GB) DDR4 3200MHz Dual Channel',
      'Kingston NV2 1TB NVMe · 6000MB/s',
      'MSI MAG A650BN 650W 80 Plus Bronze',
      'Montech X3 Mesh · Mid Tower ATX',
      'DeepCool AK400 · 120mm Tower'
    ],
    pecasIds: {
      cpu: 'cpu-r5-5600',
      placamae: 'mb-asus-b550m',
      ram: 'ram-16gb-ddr4',
      gpu: 'gpu-rtx4060',
      armazenamento: 'ssd-nvme-1tb',
      fonte: 'psu-msi-650w',
      gabinete: 'case-montech-x3',
      cooler: 'cooler-deepcool-ak400'
    },
    preset3D: {
      corLedHex: '#ff8533',
      labelNivel: 'Nível Intermediário — Mid-Tower (RTX 4060 + Air Cooler Tower)',
      tipoCooler: 'air-tower',
      tamanhoGpu: 'dual-fan'
    }
  },
  {
    id: 'gamer-intermediario-am5',
    nivel: 'Intermediário',
    etiquetaTopo: 'INTERMEDIÁRIO PLUS · AM5 DDR5',
    tituloCard: 'Intermediário Plus · Ryzen 5 7600 & RTX 5060',
    nome: 'Konoha Jounin — AM5 DDR5 & GeForce RTX 5060 GDDR7',
    chamadaCurta: 'Nova geração AM5 com 32GB DDR5 e placa de vídeo RTX 5060 GDDR7.',
    perfilUso: 'Projetado para quem quer longevidade de plataforma (AM5/DDR5) rodando tudo em 1080p Ultra e 1440p Alto com DLSS 4.',
    imagem: 'img/pecas/reais/gpu-6-geforce-rtx-5060-nvidia-8gb-gddr7-115w-12v-2x6.jpg',
    componentesPrincipais: [
      'AMD Ryzen 5 7600 · 6C/12T até 5.1GHz (AM5)',
      'NVIDIA GeForce RTX 5060 · 8GB GDDR7',
      'MSI PRO B650M-P · AM5 DDR5',
      '32GB (2×16GB) Kingston Fury Beast DDR5 5600MHz',
      'Kingston NV2 1TB NVMe · 6000MB/s',
      'MSI MAG A650BN 650W 80 Plus Bronze',
      'Montech X3 Mesh · Mid Tower 6 Fans',
      'DeepCool AK400 · 120mm Tower 220W'
    ],
    pecasIds: {
      cpu: 'cpu-r5-7600',
      placamae: 'mb-17-msi-pro-b650m-p',
      ram: 'ram-8-kingston-fury-beast-32gb-ddr5',
      gpu: 'gpu-6-geforce-rtx-5060-8gb',
      armazenamento: 'ssd-nvme-1tb',
      fonte: 'psu-msi-650w',
      gabinete: 'case-montech-x3',
      cooler: 'cooler-deepcool-ak400'
    },
    preset3D: {
      corLedHex: '#ff8533',
      labelNivel: 'Intermediário Plus — AM5 Ryzen 5 7600 + RTX 5060 GDDR7',
      tipoCooler: 'air-tower',
      tamanhoGpu: 'dual-fan'
    }
  },
  {
    id: 'gamer-avancado',
    nivel: 'Avançado',
    etiquetaTopo: 'NÍVEL AVANÇADO',
    tituloCard: 'Avançado · Quad HD 1440p Ultra',
    nome: 'Konoha Hokage — Quad HD 1440p & Alto Desempenho',
    chamadaCurta: 'Plataforma AM5 DDR5 com 3D V-Cache e RTX 4070 Super 12GB.',
    perfilUso: 'Projetado para monitores de 144Hz a 240Hz em 1440p (Quad HD) no Ultra e streaming simultâneo.',
    imagem: 'img/pecas/pc-studio-3.webp',
    componentesPrincipais: [
      'AMD Ryzen 7 7800X3D · 8C/16T 3D V-Cache',
      'Gigabyte RTX 4070 Super · 12GB GDDR6X',
      'MSI MAG B650 Tomahawk WiFi · ATX',
      '32GB (2×16GB) DDR5 6000MHz Dual Channel',
      'WD Black SN850X 2TB NVMe · 7300MB/s',
      'Corsair RM750e 750W 80 Plus Gold Modular',
      'Corsair 4000D Airflow · Mid Tower ATX',
      'Water Cooler ML240L V2 · 240mm'
    ],
    pecasIds: {
      cpu: 'cpu-r7-7800x3d',
      placamae: 'mb-msi-b650-atx',
      ram: 'ram-32gb-ddr5',
      gpu: 'gpu-rtx4070s',
      armazenamento: 'ssd-nvme-2tb',
      fonte: 'psu-corsair-750w',
      gabinete: 'case-corsair-4000d',
      cooler: 'cooler-ml240l'
    },
    preset3D: {
      corLedHex: '#ff5500',
      labelNivel: 'Nível Avançado — Chassi Airflow (RTX 4070 Super Triple Fan + Water Cooler 240mm)',
      tipoCooler: 'water-240',
      tamanhoGpu: 'triple-fan'
    }
  },
  {
    id: 'gamer-extremo',
    nivel: 'Avançado',
    etiquetaTopo: 'ENTUSIASTA · 4K ULTRA',
    tituloCard: 'Entusiasta 4K · Ryzen 7 9800X3D & RTX 5080',
    nome: 'Konoha Rikudou — 4K Ultra Ray Tracing & GDDR7',
    chamadaCurta: 'O processador gamer mais rápido do mundo (Zen 5 X3D) aliado à GeForce RTX 5080 16GB.',
    perfilUso: 'Desempenho extremo sem concessões para 1440p 360Hz+ competitivo e 4K Ultra com Path Tracing ativo.',
    imagem: 'img/pecas/reais/gpu-10-geforce-rtx-5080-nvidia-16gb-gddr7-400w-12v-2x6.jpg',
    componentesPrincipais: [
      'AMD Ryzen 7 9800X3D · 8C/16T até 5.2GHz (Zen 5)',
      'NVIDIA GeForce RTX 5080 · 16GB GDDR7',
      'Gigabyte X870 Aorus Elite WiFi7 · AM5 ATX',
      '32GB (2×16GB) XPG Lancer RGB DDR5 6000MHz CL30',
      'Samsung 990 PRO 2TB NVMe · 7450MB/s',
      'MSI MPG A1000G PCIE5 1000W 80 Plus Gold',
      'Corsair 4000D Airflow · Mid Tower ATX',
      'Water Cooler DeepCool LS720 · 360mm ARGB'
    ],
    pecasIds: {
      cpu: 'cpu-36-amd-ryzen-7-9800x3d',
      placamae: 'mb-23-gigabyte-x870-aorus-elite-wifi7',
      ram: 'ram-9-xpg-lancer-rgb-32gb-ddr5',
      gpu: 'gpu-10-geforce-rtx-5080-16gb',
      armazenamento: 'storage-10-samsung-990-pro-2tb-nvme',
      fonte: 'psu-23-msi-mpg-a1000g-pcie5-1000w-gold',
      gabinete: 'case-corsair-4000d',
      cooler: 'cooler-9-deepcool-ls720-360mm'
    },
    preset3D: {
      corLedHex: '#ff5500',
      labelNivel: 'Entusiasta 4K — Ryzen 7 9800X3D + RTX 5080 16GB + Water Cooler',
      tipoCooler: 'water-240',
      tamanhoGpu: 'triple-fan'
    }
  }
];

export const PCS_TRABALHO: PcPronto[] = [
  {
    id: 'trabalho-economico',
    limitacaoCurta: 'Focado em estudos e tarefas leves; 4 núcleos e 8GB de RAM não atendem softwares pesados.',
    nivel: 'Básico',
    etiquetaTopo: 'ECONÔMICO · HOME OFFICE',
    tituloCard: 'Econômico · Home Office & Estudos',
    subtitulo: 'Navegação, Aulas On-line e Sistemas Administrativos',
    chamadaCurta: 'Menor investimento para home office, caixa/PDV, estudos e pacote Office.',
    finalidade: 'Projetado para estudantes e escritórios que buscam economia máxima com inicialização rápida via SSD.',
    imagem: 'img/pecas/reais/cpu-amd-1-amd-ryzen-3-3200g.jpg',
    especificacoesLista: [
      'AMD Ryzen 3 3200G · 4C/4T até 4.0GHz',
      'Radeon Vega 8 integrado',
      'MSI A520M-A PRO · AM4',
      '8GB Kingston ValueRAM DDR4 2666MHz',
      'Kingston A400 480GB SATA · 500MB/s',
      'Cooler Master MWE 450W Bronze',
      'Pichau HX300M Glass · Micro-ATX',
      'Cooler Box Padrão · até 65W'
    ],
    componentesPrincipais: [
      'Processador AMD Ryzen 3 3200G (4C/4T com Radeon Vega 8)',
      'Placa-Mãe MSI A520M-A PRO AM4',
      'Fonte Cooler Master MWE 450W 80 Plus Bronze'
    ],
    memoriaResumo: '8GB DDR4 2666MHz (Expansível até 64GB)',
    armazenamentoResumo: 'SSD Kingston A400 480GB SATA III (500MB/s)',
    limitacoes: [
      'Processador de 4 núcleos e 8GB de RAM: voltado exclusivamente para rotinas leves de escritório e estudos.',
      'Não indicado para AutoCAD, programação com containers ou edição de vídeo.'
    ],
    pecasIds: {
      cpu: 'cpu-17-amd-ryzen-3-3200g',
      placamae: 'mb-msi-a520m',
      ram: 'ram-1-kingston-valueram-8gb',
      gpu: 'gpu-integrada',
      armazenamento: 'ssd-sata-480gb',
      fonte: 'psu-cm-450w',
      gabinete: 'case-hx300m',
      cooler: 'cooler-box-padrao'
    }
  },
  {
    id: 'trabalho-basico',
    limitacaoCurta: 'Não indicado para AutoCAD, 3D ou edição de vídeo pesada.',
    nivel: 'Básico',
    etiquetaTopo: 'NÍVEL BÁSICO',
    tituloCard: 'Básico · Escritório',
    subtitulo: 'Estudos, Escritório e Tarefas Cotidianas',
    chamadaCurta: 'Navegação, estudos, documentos, planilhas leves e videochamadas.',
    finalidade: 'Ideal para uso diário leve: navegação, estudos, edição de textos, planilhas simples, aulas on-line e sistemas administrativos.',
    imagem: 'img/pecas/pc-studio-1.webp',
    especificacoesLista: [
      'AMD Ryzen 5 4600G · 6C/12T',
      'Radeon Vega 7 integrado',
      'MSI A520M-A PRO · AM4',
      '8GB DDR4 3200MHz (até 64GB)',
      'Kingston A400 480GB SATA · 500MB/s',
      'Cooler Master MWE 450W Bronze',
      'Pichau HX300M Glass · Micro-ATX',
      'Cooler Box Padrão · até 65W'
    ],
    componentesPrincipais: [
      'Processador AMD Ryzen 5 4600G (6C/12T com Radeon Vega 7)',
      'Placa-Mãe MSI A520M-A PRO AM4',
      'Fonte Cooler Master MWE 450W 80 Plus Bronze'
    ],
    memoriaResumo: '8GB DDR4 3200MHz (Expansível até 64GB)',
    armazenamentoResumo: 'SSD Kingston A400 480GB SATA III (500MB/s)',
    limitacoes: [
      '8GB de RAM e vídeo integrado: não é recomendado para AutoCAD, modelagem 3D ou edição de vídeo pesada.',
      'Armazenamento SATA III de 480GB: bom para uso diário, mas tem menor taxa de transferência que NVMe para arquivos grandes.'
    ],
    pecasIds: {
      cpu: 'cpu-r5-4600g',
      placamae: 'mb-msi-a520m',
      ram: 'ram-8gb-ddr4',
      gpu: 'gpu-integrada',
      armazenamento: 'ssd-sata-480gb',
      fonte: 'psu-cm-450w',
      gabinete: 'case-hx300m',
      cooler: 'cooler-box-padrao'
    }
  },
  {
    id: 'trabalho-corporativo-intel',
    limitacaoCurta: 'Excelente para multitarefa de escritório e código; sem GPU dedicada para 3D pesado.',
    nivel: 'Intermediário',
    etiquetaTopo: 'CORPORATIVO · INTEL 14ª GER',
    tituloCard: 'Corporativo · Core i3-14100 & 16GB',
    subtitulo: 'Gestão Empresarial, Contabilidade e Desenvolvimento Web',
    chamadaCurta: 'Intel de 14ª geração até 4.7GHz com 16GB em Dual Channel e SSD NVMe de 1TB.',
    finalidade: 'Indicado para ambientes corporativos exigentes, sistemas ERP, dezenas de planilhas abertas e desenvolvimento web fluido.',
    imagem: 'img/pecas/reais/cpu-intel-3-intel-core-i3-14100.jpg',
    especificacoesLista: [
      'Intel Core i3-14100 · 4C/8T até 4.7GHz',
      'Intel UHD Graphics 730 integrado',
      'ASUS Prime H610M-E D4 · LGA 1700',
      '16GB (2×8GB) Kingston Fury Beast DDR4 3200MHz',
      'Kingston NV2 1TB NVMe · 6000MB/s',
      'Cooler Master MWE 450W Bronze',
      'Pichau HX300M Glass · Micro-ATX',
      'Cooler Box Padrão · até 65W'
    ],
    componentesPrincipais: [
      'Processador Intel Core i3-14100 (até 4.7GHz, UHD 730)',
      'Placa-Mãe ASUS Prime H610M-E D4 LGA 1700',
      '16GB Dual Channel + SSD Kingston NV2 1TB NVMe'
    ],
    memoriaResumo: '16GB (2x8GB) DDR4 3200MHz Dual Channel',
    armazenamentoResumo: 'SSD Kingston NV2 1TB M.2 NVMe (6000MB/s)',
    limitacoes: [
      'Gráfico integrado Intel UHD 730 atende múltiplos monitores e plantas 2D, mas não substitui uma placa RTX em modelagem 3D.'
    ],
    pecasIds: {
      cpu: 'cpu-3-intel-core-i3-14100',
      placamae: 'mb-5-asus-prime-h610m-e-d4',
      ram: 'ram-16gb-ddr4',
      gpu: 'gpu-integrada',
      armazenamento: 'ssd-nvme-1tb',
      fonte: 'psu-cm-450w',
      gabinete: 'case-hx300m',
      cooler: 'cooler-box-padrao'
    }
  },
  {
    id: 'trabalho-intermediario',
    limitacaoCurta: 'Sem placa de vídeo dedicada: limitado em AutoCAD 3D e renderização.',
    nivel: 'Intermediário',
    etiquetaTopo: 'NÍVEL INTERMEDIÁRIO',
    tituloCard: 'Intermediário · Multitarefa',
    subtitulo: 'Multitarefas, Programação e Produtividade',
    chamadaCurta: 'Desenvolvimento, análise de dados e multitarefa com dois monitores.',
    finalidade: 'Ideal para desenvolvimento, análise de dados, planilhas complexas e multitarefa intensa com dois monitores.',
    imagem: 'img/pecas/pc-studio-2.webp',
    especificacoesLista: [
      'AMD Ryzen 5 7600 · Zen 4 · até 5.1GHz',
      'Radeon RDNA 2 integrado',
      'MSI MAG B650 Tomahawk WiFi ATX',
      '32GB (2×16GB) DDR5 6000MHz',
      'Kingston NV2 1TB NVMe · 6000MB/s',
      'Cooler Master MWE 450W Bronze',
      'Corsair 4000D Airflow · ATX',
      'DeepCool AK400 · 120mm'
    ],
    componentesPrincipais: [
      'Processador AMD Ryzen 5 7600 (6C/12T até 5.1GHz, Zen 4)',
      'Placa-Mãe MSI MAG B650 Tomahawk WiFi ATX',
      'Air Cooler DeepCool AK400 120mm'
    ],
    memoriaResumo: '32GB (2x16GB) DDR5 6000MHz Dual Channel',
    armazenamentoResumo: 'SSD Kingston NV2 1TB M.2 NVMe (6000MB/s)',
    limitacoes: [
      'Usa vídeo integrado Radeon RDNA 2: bom para 2D leve, mas não tem VRAM dedicada para AutoCAD 3D ou renderização GPU.',
      'Para modelagem 3D futura, será necessário adicionar uma placa de vídeo dedicada.'
    ],
    pecasIds: {
      cpu: 'cpu-r5-7600',
      placamae: 'mb-msi-b650-atx',
      ram: 'ram-32gb-ddr5',
      gpu: 'gpu-integrada',
      armazenamento: 'ssd-nvme-1tb',
      fonte: 'psu-cm-450w',
      gabinete: 'case-corsair-4000d',
      cooler: 'cooler-deepcool-ak400'
    }
  },
  {
    id: 'trabalho-profissional',
    limitacaoCurta: 'Simulações muito pesadas podem pedir uma placa de vídeo mais forte.',
    nivel: 'Profissional',
    etiquetaTopo: 'NÍVEL PROFISSIONAL',
    tituloCard: 'Profissional · AutoCAD',
    subtitulo: 'AutoCAD, Desenho Técnico 2D/3D e Engenharia',
    chamadaCurta: 'AutoCAD 2D/3D, arquitetura técnica e engenharia.',
    finalidade: 'Ideal para AutoCAD 2D/3D, arquitetura técnica, compilação pesada e edição gráfica com 32GB de RAM e GPU dedicada.',
    imagem: 'img/pecas/pc-studio-3.webp',
    especificacoesLista: [
      'AMD Ryzen 7 5700X3D · 8C/16T',
      'NVIDIA GeForce RTX 4060 · 8GB GDDR6',
      'ASUS TUF Gaming B550M-Plus',
      'Corsair 32GB DDR4 3600MHz',
      'Kingston NV2 1TB NVMe · 6000MB/s',
      'MSI MAG A650BN 650W Bronze',
      'Corsair 4000D Airflow · ATX',
      'DeepCool AK400 · 120mm'
    ],
    componentesPrincipais: [
      'Processador AMD Ryzen 7 5700X3D (8C/16T) + DeepCool AK400',
      'Placa de Vídeo NVIDIA GeForce RTX 4060 8GB GDDR6',
      'Placa-Mãe ASUS TUF Gaming B550M-Plus'
    ],
    memoriaResumo: '32GB (2x16GB) Corsair Vengeance DDR4 3600MHz',
    armazenamentoResumo: 'SSD Kingston NV2 1TB M.2 NVMe (6000MB/s)',
    limitacoes: [
      'Embora atenda com excelência AutoCAD 2D e modelagem 3D técnica (8GB de VRAM dedicada e 32GB de RAM), simulações industriais de malha extrema ou nuvens de pontos massivas (> 64GB RAM) podem demandar upgrade para a Workstation de 64GB.',
      'Consumo superior devido à placa de vídeo dedicada.'
    ],
    pecasIds: {
      cpu: 'cpu-r7-5700x3d',
      placamae: 'mb-asus-b550m',
      ram: 'ram-32gb-ddr4',
      gpu: 'gpu-rtx4060',
      armazenamento: 'ssd-nvme-1tb',
      fonte: 'psu-msi-650w',
      gabinete: 'case-corsair-4000d',
      cooler: 'cooler-deepcool-ak400'
    }
  },
  {
    id: 'trabalho-workstation-ia',
    limitacaoCurta: 'Estação de topo; exige tomada aterrada e bom fluxo de ar no ambiente.',
    nivel: 'Profissional',
    etiquetaTopo: 'WORKSTATION · RENDER 3D & IA',
    tituloCard: 'Workstation · Ryzen 9 9950X, 64GB & RTX 5070 Ti',
    subtitulo: 'Renderização 3D Pesada, BIM Completo, Vídeo 4K/8K e IA Local',
    chamadaCurta: '16 núcleos/32 threads Zen 5, 64GB DDR5 7200MHz e GeForce RTX 5070 Ti 16GB GDDR7.',
    finalidade: 'Projetado para escritórios de arquitetura, engenharia civil/mecânica (Revit, SolidWorks, Lumion, V-Ray, Blender) e execução local de modelos de IA.',
    imagem: 'img/pecas/reais/cpu-amd-21-amd-ryzen-9-9950x.jpg',
    especificacoesLista: [
      'AMD Ryzen 9 9950X · 16C/32T até 5.7GHz',
      'NVIDIA GeForce RTX 5070 Ti · 16GB GDDR7',
      'MSI MAG X670E Tomahawk WiFi · ATX',
      '64GB (2×32GB) G.Skill Trident Z5 DDR5 7200MHz',
      'Samsung 990 PRO 2TB NVMe · 7450MB/s',
      'XPG Core Reactor II 850W Gold ATX 3.0',
      'Corsair 4000D Airflow · Mid Tower ATX',
      'Water Cooler DeepCool LS720 · 360mm'
    ],
    componentesPrincipais: [
      'Processador AMD Ryzen 9 9950X (16C/32T até 5.7GHz, Zen 5)',
      'Placa de Vídeo NVIDIA GeForce RTX 5070 Ti 16GB GDDR7',
      '64GB DDR5 7200MHz + SSD Samsung 990 PRO 2TB (7450MB/s)'
    ],
    memoriaResumo: '64GB (2x32GB) G.Skill Trident Z5 DDR5 7200MHz',
    armazenamentoResumo: 'SSD Samsung 990 PRO 2TB NVMe Gen4 (7450MB/s)',
    limitacoes: [
      'Consumo energético e dissipação térmica de nível workstation sob carga máxima de renderização contínua.'
    ],
    pecasIds: {
      cpu: 'cpu-38-amd-ryzen-9-9950x',
      placamae: 'mb-20-msi-mag-x670e-tomahawk-wifi',
      ram: 'ram-11-g-skill-trident-z5-rgb-64gb-ddr5',
      gpu: 'gpu-9-geforce-rtx-5070-ti-16gb',
      armazenamento: 'storage-10-samsung-990-pro-2tb-nvme',
      fonte: 'psu-15-xpg-core-reactor-ii-850w-gold',
      gabinete: 'case-corsair-4000d',
      cooler: 'cooler-9-deepcool-ls720-360mm'
    }
  }
];

export const EQUIPE_DESENVOLVIMENTO: { nome: string; iniciais: string; funcao: string }[] = [
  {
    nome: 'Leonardo Fioramonte de Oliveira',
    iniciais: 'LF',
    funcao: 'Liderança técnica e integração de dados'
  },
  {
    nome: 'Breno Martinho Denis',
    iniciais: 'BM',
    funcao: 'Telas iniciais e identidade visual'
  },
  {
    nome: 'Eduardo Francisco Bernardes da Silva',
    iniciais: 'EF',
    funcao: 'Catálogo de componentes'
  },
  {
    nome: 'Giovane Betez Romo',
    iniciais: 'GB',
    funcao: 'Resumo e orçamento'
  },
  {
    nome: 'Edwin Bono Sanches',
    iniciais: 'EB',
    funcao: 'Compatibilidade e lógica'
  },
  {
    nome: 'Gabriel Rocha Martins',
    iniciais: 'GR',
    funcao: 'Testes e integração'
  }
];
