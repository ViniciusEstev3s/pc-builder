import type { Categoria, CategoriaInfo, Peca } from './tipos';

/**
 * Base de Dados de Componentes de Hardware — Konoha Hardware
 * 
 * Organização nas 8 categorias essenciais:
 * 1. Processador (cpu)
 * 2. Placa-mãe (placamae)
 * 3. Memória RAM (ram)
 * 4. Placa de vídeo (gpu)
 * 5. Armazenamento (armazenamento)
 * 6. Fonte (fonte)
 * 7. Gabinete (gabinete)
 * 8. Cooler (cooler)
 */

export const CATEGORIAS_MONTADOR: CategoriaInfo[] = [
  {
    id: 'cpu',
    ordem: 1,
    nome: '1. Processador',
    tituloCurto: 'Processador',
    descricao: 'Unidade central de processamento (CPU). Define o soquete da placa-mãe e o poder de cálculo.',
    iconeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
    obrigatorio: true
  },
  {
    id: 'placamae',
    ordem: 2,
    nome: '2. Placa-mãe',
    tituloCurto: 'Placa-mãe',
    descricao: 'Conecta todos os componentes. Deve ter o mesmo soquete do processador e suportar o padrão da RAM.',
    iconeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="5" height="5" rx="1"/><path d="M15 7h2M15 10h2M7 15h10M7 18h6"/></svg>',
    obrigatorio: true
  },
  {
    id: 'ram',
    ordem: 3,
    nome: '3. Memória RAM',
    tituloCurto: 'Memória RAM',
    descricao: 'Memória principal de acesso rápido. Deve ser compatível com o padrão DDR4 ou DDR5 da placa-mãe.',
    iconeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="9" rx="1.5"/><path d="M6 16v3M10 16v3M14 16v3M18 16v3M6 10v3M10 10v3M14 10v3M18 10v3"/></svg>',
    obrigatorio: true
  },
  {
    id: 'gpu',
    ordem: 4,
    nome: '4. Placa de vídeo',
    tituloCurto: 'Placa de Vídeo',
    descricao: 'Processamento gráfico (GPU). Essencial para jogos 3D, CAD avançado e processadores sem vídeo integrado.',
    iconeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8.5" cy="12" r="3"/><circle cx="15.5" cy="12" r="3"/><path d="M5 18v3M9 18v3"/></svg>',
    obrigatorio: true
  },
  {
    id: 'armazenamento',
    ordem: 5,
    nome: '5. Armazenamento',
    tituloCurto: 'Armazenamento',
    descricao: 'Unidade SSD/HDD para sistema operacional, programas, arquivos e carregamento rápido de jogos.',
    iconeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 12h4M16 12h.01M3 10h18"/></svg>',
    obrigatorio: true
  },
  {
    id: 'fonte',
    ordem: 6,
    nome: '6. Fonte',
    tituloCurto: 'Fonte',
    descricao: 'Fornece energia estável e segura. Sua potência (Watts) deve suprir todos os componentes com folga.',
    iconeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M13 8l-3 4h4l-3 4"/></svg>',
    obrigatorio: true
  },
  {
    id: 'gabinete',
    ordem: 7,
    nome: '7. Gabinete',
    tituloCurto: 'Gabinete',
    descricao: 'Estrutura física e fluxo de ar. Deve comportar o formato da placa-mãe e o comprimento da placa de vídeo.',
    iconeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6h6M9 10h6"/><circle cx="12" cy="17" r="1.5"/></svg>',
    obrigatorio: true
  },
  {
    id: 'cooler',
    ordem: 8,
    nome: '8. Cooler',
    tituloCurto: 'Cooler',
    descricao: 'Dissipação térmica do processador. Deve suportar o soquete e o TDP térmico da CPU escolhida.',
    iconeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 5.5c1.8 1.5 1.8 3.2 0 4M18.5 12c-1.5 1.8-3.2 1.8-4 0M12 18.5c-1.8-1.5-1.8-3.2 0-4M5.5 12c1.5-1.8 3.2-1.8 4 0"/></svg>',
    obrigatorio: true
  }
];

export const CATALOGO_PECAS: Record<Categoria, Peca[]> = {
  "cpu": [
    {
      "id": "cpu-r5-4600g",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 5 4600G",
      "resumoSpecs": "6C/12T · AM4 · 65W",
      "nome": "AMD Ryzen 5 4600G, 6C/12T, 3.7 / 4.2 GHz, AM4 — Escritório Avançado / Jogos Leves",
      "marca": "AMD",
      "preco": 700,
      "imagem": "img/pecas/reais/cpu-amd-2-amd-ryzen-5-4600g.jpg",
      "especificacoes": [
        "Soquete: AM4 · Memória: DDR4",
        "Núcleos/Threads: 6C/12T · Frequência: 3.7 / 4.2 GHz",
        "Gráficos Integrados: Radeon Vega 7",
        "TDP: 65W · Perfil: Escritório Avançado / Jogos Leves"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": true,
      "nivelCpu": 1,
      "pontuacaoMultitarefa": 75
    },
    {
      "id": "cpu-1-intel-core-i3-10100",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i3-10100",
      "resumoSpecs": "4C/8T · LGA1200 · 65W",
      "nome": "Intel Core i3-10100, 4C/8T, 3.6 / 4.3 GHz, LGA 1200 — Escritório / Básico",
      "marca": "Intel",
      "preco": 900,
      "imagem": "img/pecas/reais/cpu-intel-1-intel-core-i3-10100.webp",
      "especificacoes": [
        "Soquete: LGA 1200 · Memória: DDR4",
        "Núcleos/Threads: 4C/8T · Frequência: 3.6 / 4.3 GHz",
        "Gráficos Integrados: Intel UHD Graphics 630",
        "TDP: 65W · Perfil: Escritório / Básico"
      ],
      "soquete": "LGA1200",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": true,
      "nivelCpu": 1,
      "pontuacaoMultitarefa": 69
    },
    {
      "id": "cpu-2-intel-core-i3-12100f",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i3-12100F",
      "resumoSpecs": "4C/8T · LGA1700 · 58W",
      "nome": "Intel Core i3-12100F, 4C/8T, 3.3 / 4.3 GHz, LGA 1700 — Gamer de Entrada / Escritório",
      "marca": "Intel",
      "preco": 800,
      "imagem": "img/pecas/reais/cpu-intel-2-intel-core-i3-12100f.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 4C/8T · Frequência: 3.3 / 4.3 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 58W · Perfil: Gamer de Entrada / Escritório"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 58,
      "possuiVideoIntegrado": false,
      "nivelCpu": 1,
      "pontuacaoMultitarefa": 69
    },
    {
      "id": "cpu-3-intel-core-i3-14100",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i3-14100",
      "resumoSpecs": "4C/8T · LGA1700 · 60W",
      "nome": "Intel Core i3-14100, 4C/8T, 3.5 / 4.7 GHz, LGA 1700 — Escritório / Multitarefa leve",
      "marca": "Intel",
      "preco": 700,
      "imagem": "img/pecas/reais/cpu-intel-3-intel-core-i3-14100.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 4C/8T · Frequência: 3.5 / 4.7 GHz",
        "Gráficos Integrados: Intel UHD Graphics 730",
        "TDP: 60W · Perfil: Escritório / Multitarefa leve"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 60,
      "possuiVideoIntegrado": true,
      "nivelCpu": 1,
      "pontuacaoMultitarefa": 69
    },
    {
      "id": "cpu-4-intel-core-i5-10400f",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i5-10400F",
      "resumoSpecs": "6C/12T · LGA1200 · 65W",
      "nome": "Intel Core i5-10400F, 6C/12T, 2.9 / 4.3 GHz, LGA 1200 — Gamer de Entrada / Escritório",
      "marca": "Intel",
      "preco": 900,
      "imagem": "img/pecas/reais/cpu-intel-4-intel-core-i5-10400f.jpg",
      "especificacoes": [
        "Soquete: LGA 1200 · Memória: DDR4",
        "Núcleos/Threads: 6C/12T · Frequência: 2.9 / 4.3 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 65W · Perfil: Gamer de Entrada / Escritório"
      ],
      "soquete": "LGA1200",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": false,
      "nivelCpu": 2,
      "pontuacaoMultitarefa": 79
    },
    {
      "id": "cpu-i5-12400f",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i5-12400F",
      "resumoSpecs": "6C/12T · LGA1700 · 65W",
      "nome": "Intel Core i5-12400F, 6C/12T, 2.5 / 4.4 GHz, LGA 1700 — Gamer Custo-Benefício",
      "marca": "Intel",
      "preco": 800,
      "imagem": "img/pecas/reais/cpu-intel-5-intel-core-i5-12400f.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 6C/12T · Frequência: 2.5 / 4.4 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 65W · Perfil: Gamer Custo-Benefício"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 65,
      "possuiVideoIntegrado": false,
      "nivelCpu": 2,
      "pontuacaoMultitarefa": 79
    },
    {
      "id": "cpu-6-intel-core-i5-13400f",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i5-13400F",
      "resumoSpecs": "10C/16T · LGA1700 · 65W",
      "nome": "Intel Core i5-13400F, 10C/16T, 2.5 / 4.6 GHz, LGA 1700 — Gamer Intermédio / Produtividade",
      "marca": "Intel",
      "preco": 1300,
      "imagem": "img/pecas/reais/cpu-intel-6-intel-core-i5-13400f.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 10C/16T · Frequência: 2.5 / 4.6 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 65W · Perfil: Gamer Intermédio / Produtividade"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 65,
      "possuiVideoIntegrado": false,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 90
    },
    {
      "id": "cpu-7-intel-core-i5-13600k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i5-13600K",
      "resumoSpecs": "14C/20T · LGA1700 · 125W",
      "nome": "Intel Core i5-13600K, 14C/20T, 3.5 / 5.1 GHz, LGA 1700 — Gamer Intermédio / Criação",
      "marca": "Intel",
      "preco": 1900,
      "imagem": "img/pecas/reais/cpu-intel-7-intel-core-i5-13600k.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 14C/20T · Frequência: 3.5 / 5.1 GHz",
        "Gráficos Integrados: Intel UHD Graphics 770",
        "TDP: 125W · Perfil: Gamer Intermédio / Criação"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 96
    },
    {
      "id": "cpu-8-intel-core-i5-14600k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i5-14600K",
      "resumoSpecs": "14C/20T · LGA1700 · 125W",
      "nome": "Intel Core i5-14600K, 14C/20T, 3.5 / 5.3 GHz, LGA 1700 — Gamer Avançado / Multitarefa",
      "marca": "Intel",
      "preco": 1700,
      "imagem": "img/pecas/reais/cpu-intel-8-intel-core-i5-14600k.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 14C/20T · Frequência: 3.5 / 5.3 GHz",
        "Gráficos Integrados: Intel UHD Graphics 770",
        "TDP: 125W · Perfil: Gamer Avançado / Multitarefa"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 96
    },
    {
      "id": "cpu-9-intel-core-i7-12700k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i7-12700K",
      "resumoSpecs": "12C/20T · LGA1700 · 125W",
      "nome": "Intel Core i7-12700K, 12C/20T, 3.6 / 5.0 GHz, LGA 1700 — Gamer Avançado / Edição",
      "marca": "Intel",
      "preco": 1800,
      "imagem": "img/pecas/reais/cpu-intel-9-intel-core-i7-12700k.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 12C/20T · Frequência: 3.6 / 5.0 GHz",
        "Gráficos Integrados: Intel UHD Graphics 770",
        "TDP: 125W · Perfil: Gamer Avançado / Edição"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 96
    },
    {
      "id": "cpu-10-intel-core-i7-13700k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i7-13700K",
      "resumoSpecs": "16C/24T · LGA1700 · 125W",
      "nome": "Intel Core i7-13700K, 16C/24T, 3.4 / 5.4 GHz, LGA 1700 — Gamer High-End / Criação de Conteúdo",
      "marca": "Intel",
      "preco": 2000,
      "imagem": "img/pecas/reais/cpu-intel-10-intel-core-i7-13700k.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 16C/24T · Frequência: 3.4 / 5.4 GHz",
        "Gráficos Integrados: Intel UHD Graphics 770",
        "TDP: 125W · Perfil: Gamer High-End / Criação de Conteúdo"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-11-intel-core-i7-14700k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i7-14700K",
      "resumoSpecs": "20C/28T · LGA1700 · 125W",
      "nome": "Intel Core i7-14700K, 20C/28T, 3.4 / 5.6 GHz, LGA 1700 — Gamer High-End / Workstation",
      "marca": "Intel",
      "preco": 2100,
      "imagem": "img/pecas/reais/cpu-intel-11-intel-core-i7-14700k.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 20C/28T · Frequência: 3.4 / 5.6 GHz",
        "Gráficos Integrados: Intel UHD Graphics 770",
        "TDP: 125W · Perfil: Gamer High-End / Workstation"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-12-intel-core-i9-13900k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i9-13900K",
      "resumoSpecs": "24C/32T · LGA1700 · 125W",
      "nome": "Intel Core i9-13900K, 24C/32T, 3.0 / 5.8 GHz, LGA 1700 — Entusiasta / Workstation",
      "marca": "Intel",
      "preco": 3000,
      "imagem": "img/pecas/reais/cpu-intel-12-intel-core-i9-13900k.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 24C/32T · Frequência: 3.0 / 5.8 GHz",
        "Gráficos Integrados: Intel UHD Graphics 770",
        "TDP: 125W · Perfil: Entusiasta / Workstation"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-13-intel-core-i9-14900k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core i9-14900K",
      "resumoSpecs": "24C/32T · LGA1700 · 125W",
      "nome": "Intel Core i9-14900K, 24C/32T, 3.2 / 6.0 GHz, LGA 1700 — Gamer Topo de Linha / Workstation",
      "marca": "Intel",
      "preco": 2900,
      "imagem": "img/pecas/reais/cpu-intel-13-intel-core-i9-14900k.jpg",
      "especificacoes": [
        "Soquete: LGA 1700 · Memória: DDR4/DDR5",
        "Núcleos/Threads: 24C/32T · Frequência: 3.2 / 6.0 GHz",
        "Gráficos Integrados: Intel UHD Graphics 770",
        "TDP: 125W · Perfil: Gamer Topo de Linha / Workstation"
      ],
      "soquete": "LGA1700",
      "tipoRamSuportada": "DDR4/DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-14-intel-core-ultra-5-245k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core Ultra 5 245K",
      "resumoSpecs": "14C/14T · LGA1851 · 125W",
      "nome": "Intel Core Ultra 5 245K, 14C/14T, 4.2 / 5.2 GHz, LGA 1851 — Gamer Moderno / Eficiência",
      "marca": "Intel",
      "preco": 1000,
      "imagem": "img/pecas/reais/cpu-intel-14-intel-core-ultra-5-245k.jpg",
      "especificacoes": [
        "Soquete: LGA 1851 · Memória: DDR5",
        "Núcleos/Threads: 14C/14T · Frequência: 4.2 / 5.2 GHz",
        "Gráficos Integrados: Intel Graphics (4 Xe-cores)",
        "TDP: 125W · Perfil: Gamer Moderno / Eficiência"
      ],
      "soquete": "LGA1851",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 86
    },
    {
      "id": "cpu-15-intel-core-ultra-7-265k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core Ultra 7 265K",
      "resumoSpecs": "20C/20T · LGA1851 · 125W",
      "nome": "Intel Core Ultra 7 265K, 20C/20T, 3.9 / 5.5 GHz, LGA 1851 — Gamer High-End / IA",
      "marca": "Intel",
      "preco": 2000,
      "imagem": "img/pecas/reais/cpu-intel-15-intel-core-ultra-7-265k.jpg",
      "especificacoes": [
        "Soquete: LGA 1851 · Memória: DDR5",
        "Núcleos/Threads: 20C/20T · Frequência: 3.9 / 5.5 GHz",
        "Gráficos Integrados: Intel Graphics (4 Xe-cores)",
        "TDP: 125W · Perfil: Gamer High-End / IA"
      ],
      "soquete": "LGA1851",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-16-intel-core-ultra-9-285k",
      "categoria": "cpu",
      "nomeCurto": "Intel Core Ultra 9 285K",
      "resumoSpecs": "24C/24T · LGA1851 · 125W",
      "nome": "Intel Core Ultra 9 285K, 24C/24T, 3.7 / 5.7 GHz, LGA 1851 — Entusiasta / Workstation IA",
      "marca": "Intel",
      "preco": 3500,
      "imagem": "img/pecas/reais/cpu-intel-16-intel-core-ultra-9-285k.jpg",
      "especificacoes": [
        "Soquete: LGA 1851 · Memória: DDR5",
        "Núcleos/Threads: 24C/24T · Frequência: 3.7 / 5.7 GHz",
        "Gráficos Integrados: Intel Graphics (4 Xe-cores)",
        "TDP: 125W · Perfil: Entusiasta / Workstation IA"
      ],
      "soquete": "LGA1851",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 125,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-17-amd-ryzen-3-3200g",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 3 3200G",
      "resumoSpecs": "4C/4T · AM4 · 65W",
      "nome": "AMD Ryzen 3 3200G, 4C/4T, 3.6 / 4.0 GHz, AM4 — Escritório / Básico (Vídeo Integrado)",
      "marca": "AMD",
      "preco": 440,
      "imagem": "img/pecas/reais/cpu-amd-1-amd-ryzen-3-3200g.jpg",
      "especificacoes": [
        "Soquete: AM4 · Memória: DDR4",
        "Núcleos/Threads: 4C/4T · Frequência: 3.6 / 4.0 GHz",
        "Gráficos Integrados: Radeon Vega 8",
        "TDP: 65W · Perfil: Escritório / Básico (Vídeo Integrado)"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": true,
      "nivelCpu": 1,
      "pontuacaoMultitarefa": 62
    },
    {
      "id": "cpu-19-amd-ryzen-5-5600g",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 5 5600G",
      "resumoSpecs": "6C/12T · AM4 · 65W",
      "nome": "AMD Ryzen 5 5600G, 6C/12T, 3.9 / 4.4 GHz, AM4 — Escritório / Jogos de Entrada",
      "marca": "AMD",
      "preco": 900,
      "imagem": "img/pecas/reais/cpu-amd-3-amd-ryzen-5-5600g.jpg",
      "especificacoes": [
        "Soquete: AM4 · Memória: DDR4",
        "Núcleos/Threads: 6C/12T · Frequência: 3.9 / 4.4 GHz",
        "Gráficos Integrados: Radeon Vega 7",
        "TDP: 65W · Perfil: Escritório / Jogos de Entrada"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": true,
      "nivelCpu": 2,
      "pontuacaoMultitarefa": 79
    },
    {
      "id": "cpu-20-amd-ryzen-5-3600",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 5 3600",
      "resumoSpecs": "6C/12T · AM4 · 65W",
      "nome": "AMD Ryzen 5 3600, 6C/12T, 3.6 / 4.2 GHz, AM4 — Gamer de Entrada Económico",
      "marca": "AMD",
      "preco": 650,
      "imagem": "img/pecas/reais/cpu-amd-4-amd-ryzen-5-3600.jpg",
      "especificacoes": [
        "Soquete: AM4 · Memória: DDR4",
        "Núcleos/Threads: 6C/12T · Frequência: 3.6 / 4.2 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 65W · Perfil: Gamer de Entrada Económico"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": false,
      "nivelCpu": 2,
      "pontuacaoMultitarefa": 79
    },
    {
      "id": "cpu-21-amd-ryzen-5-5500",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 5 5500",
      "resumoSpecs": "6C/12T · AM4 · 65W",
      "nome": "AMD Ryzen 5 5500, 6C/12T, 3.6 / 4.2 GHz, AM4 — Gamer de Entrada Custo-Benefício",
      "marca": "AMD",
      "preco": 600,
      "imagem": "img/pecas/reais/cpu-amd-5-amd-ryzen-5-5500.jpg",
      "especificacoes": [
        "Soquete: AM4 · Memória: DDR4",
        "Núcleos/Threads: 6C/12T · Frequência: 3.6 / 4.2 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 65W · Perfil: Gamer de Entrada Custo-Benefício"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": false,
      "nivelCpu": 2,
      "pontuacaoMultitarefa": 79
    },
    {
      "id": "cpu-r5-5600",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 5 5600",
      "resumoSpecs": "6C/12T · AM4 · 65W",
      "nome": "AMD Ryzen 5 5600, 6C/12T, 3.5 / 4.4 GHz, AM4 — Gamer Intermédio Custo-Benefício",
      "marca": "AMD",
      "preco": 900,
      "imagem": "img/pecas/reais/cpu-amd-6-amd-ryzen-5-5600.jpg",
      "especificacoes": [
        "Soquete: AM4 · Memória: DDR4",
        "Núcleos/Threads: 6C/12T · Frequência: 3.5 / 4.4 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 65W · Perfil: Gamer Intermédio Custo-Benefício"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": false,
      "nivelCpu": 2,
      "pontuacaoMultitarefa": 79
    },
    {
      "id": "cpu-23-amd-ryzen-7-5700x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 7 5700X",
      "resumoSpecs": "8C/16T · AM4 · 65W",
      "nome": "AMD Ryzen 7 5700X, 8C/16T, 3.4 / 4.6 GHz, AM4 — Gamer Intermédio / Produtividade",
      "marca": "AMD",
      "preco": 1200,
      "imagem": "img/pecas/reais/cpu-amd-7-amd-ryzen-7-5700x.jpg",
      "especificacoes": [
        "Soquete: AM4 · Memória: DDR4",
        "Núcleos/Threads: 8C/16T · Frequência: 3.4 / 4.6 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 65W · Perfil: Gamer Intermédio / Produtividade"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 65,
      "possuiVideoIntegrado": false,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 90
    },
    {
      "id": "cpu-r7-5700x3d",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 7 5700X3D",
      "resumoSpecs": "8C/16T · AM4 · 100MB · 105W",
      "nome": "AMD Ryzen 7 5700X3D, 8-Core, 16-Threads, 3.0GHz (4.1GHz Turbo), Cache 100MB, AM4",
      "marca": "AMD",
      "preco": 1499.9,
      "imagem": "img/pecas/cpu-ryzen7.webp",
      "especificacoes": [
        "Soquete: AM4 (3D V-Cache) · DDR4",
        "8 Núcleos / 16 Threads · Cache 100MB",
        "Sem vídeo integrado (Exige GPU e Cooler Tower)",
        "TDP: 105W"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 105,
      "possuiVideoIntegrado": false,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 90
    },
    {
      "id": "cpu-25-amd-ryzen-7-5800x3d",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 7 5800X3D",
      "resumoSpecs": "8C/16T · AM4 · 105W",
      "nome": "AMD Ryzen 7 5800X3D, 8C/16T, 3.4 / 4.5 GHz, AM4 — Gamer Alto Desempenho (AM4)",
      "marca": "AMD",
      "preco": 2000,
      "imagem": "img/pecas/reais/cpu-amd-8-amd-ryzen-7-5800x3d.jpg",
      "especificacoes": [
        "Soquete: AM4 · Memória: DDR4",
        "Núcleos/Threads: 8C/16T · Frequência: 3.4 / 4.5 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 105W · Perfil: Gamer Alto Desempenho (AM4)"
      ],
      "soquete": "AM4",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 105,
      "possuiVideoIntegrado": false,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 90
    },
    {
      "id": "cpu-r5-7600",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 5 7600",
      "resumoSpecs": "6C/12T · AM5 · 65W",
      "nome": "AMD Ryzen 5 7600, 6C/12T, 3.8 / 5.1 GHz, AM5 — Gamer Intermédio Atual (DDR5)",
      "marca": "AMD",
      "preco": 1300,
      "imagem": "img/pecas/reais/cpu-amd-9-amd-ryzen-5-7600.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 6C/12T · Frequência: 3.8 / 5.1 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 65W · Perfil: Gamer Intermédio Atual (DDR5)"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 65,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 83
    },
    {
      "id": "cpu-27-amd-ryzen-5-7600x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 5 7600X",
      "resumoSpecs": "6C/12T · AM5 · 105W",
      "nome": "AMD Ryzen 5 7600X, 6C/12T, 4.7 / 5.3 GHz, AM5 — Gamer Intermédio Alto",
      "marca": "AMD",
      "preco": 1400,
      "imagem": "img/pecas/reais/cpu-amd-10-amd-ryzen-5-7600x.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 6C/12T · Frequência: 4.7 / 5.3 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 105W · Perfil: Gamer Intermédio Alto"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 105,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 83
    },
    {
      "id": "cpu-28-amd-ryzen-7-7700",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 7 7700",
      "resumoSpecs": "8C/16T · AM5 · 65W",
      "nome": "AMD Ryzen 7 7700, 8C/16T, 3.8 / 5.3 GHz, AM5 — Gamer Avançado / Eficiente",
      "marca": "AMD",
      "preco": 1650,
      "imagem": "img/pecas/reais/cpu-amd-11-amd-ryzen-7-7700.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 8C/16T · Frequência: 3.8 / 5.3 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 65W · Perfil: Gamer Avançado / Eficiente"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 65,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 90
    },
    {
      "id": "cpu-29-amd-ryzen-7-7700x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 7 7700X",
      "resumoSpecs": "8C/16T · AM5 · 105W",
      "nome": "AMD Ryzen 7 7700X, 8C/16T, 4.5 / 5.4 GHz, AM5 — Gamer Avançado / Produtividade",
      "marca": "AMD",
      "preco": 1750,
      "imagem": "img/pecas/reais/cpu-amd-12-amd-ryzen-7-7700x.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 8C/16T · Frequência: 4.5 / 5.4 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 105W · Perfil: Gamer Avançado / Produtividade"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 105,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 90
    },
    {
      "id": "cpu-r7-7800x3d",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 7 7800X3D",
      "resumoSpecs": "8C/16T · AM5 · 120W",
      "nome": "AMD Ryzen 7 7800X3D, 8C/16T, 4.2 / 5.0 GHz, AM5 — Gamer Competitivo / Topo para Jogos",
      "marca": "AMD",
      "preco": 2000,
      "imagem": "img/pecas/reais/cpu-amd-13-amd-ryzen-7-7800x3d.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 8C/16T · Frequência: 4.2 / 5.0 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 120W · Perfil: Gamer Competitivo / Topo para Jogos"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 120,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 94
    },
    {
      "id": "cpu-31-amd-ryzen-9-7900x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 9 7900X",
      "resumoSpecs": "12C/24T · AM5 · 170W",
      "nome": "AMD Ryzen 9 7900X, 12C/24T, 4.7 / 5.6 GHz, AM5 — Gamer High-End / Workstation",
      "marca": "AMD",
      "preco": 2100,
      "imagem": "img/pecas/reais/cpu-amd-14-amd-ryzen-9-7900x.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 12C/24T · Frequência: 4.7 / 5.6 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 170W · Perfil: Gamer High-End / Workstation"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 170,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-32-amd-ryzen-9-7950x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 9 7950X",
      "resumoSpecs": "16C/32T · AM5 · 170W",
      "nome": "AMD Ryzen 9 7950X, 16C/32T, 4.5 / 5.7 GHz, AM5 — Workstation / Renderização 3D",
      "marca": "AMD",
      "preco": 3700,
      "imagem": "img/pecas/reais/cpu-amd-15-amd-ryzen-9-7950x.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 16C/32T · Frequência: 4.5 / 5.7 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 170W · Perfil: Workstation / Renderização 3D"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 170,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-33-amd-ryzen-9-7950x3d",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 9 7950X3D",
      "resumoSpecs": "16C/32T · AM5 · 120W",
      "nome": "AMD Ryzen 9 7950X3D, 16C/32T, 4.2 / 5.7 GHz, AM5 — Gamer Topo de Linha / Workstation",
      "marca": "AMD",
      "preco": 4200,
      "imagem": "img/pecas/reais/cpu-amd-16-amd-ryzen-9-7950x3d.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 16C/32T · Frequência: 4.2 / 5.7 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 120W · Perfil: Gamer Topo de Linha / Workstation"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 120,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-34-amd-ryzen-5-9600x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 5 9600X",
      "resumoSpecs": "6C/12T · AM5 · 65W",
      "nome": "AMD Ryzen 5 9600X, 6C/12T, 3.9 / 5.4 GHz, AM5 — Gamer Nova Geração (Zen 5)",
      "marca": "AMD",
      "preco": 1400,
      "imagem": "img/pecas/reais/cpu-amd-17-amd-ryzen-5-9600x.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 6C/12T · Frequência: 3.9 / 5.4 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 65W · Perfil: Gamer Nova Geração (Zen 5)"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 65,
      "possuiVideoIntegrado": true,
      "nivelCpu": 3,
      "pontuacaoMultitarefa": 83
    },
    {
      "id": "cpu-35-amd-ryzen-7-9700x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 7 9700X",
      "resumoSpecs": "8C/16T · AM5 · 65W",
      "nome": "AMD Ryzen 7 9700X, 8C/16T, 3.8 / 5.5 GHz, AM5 — Gamer Avançado Eficiente (Zen 5)",
      "marca": "AMD",
      "preco": 1800,
      "imagem": "img/pecas/reais/cpu-amd-18-amd-ryzen-7-9700x.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 8C/16T · Frequência: 3.8 / 5.5 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 65W · Perfil: Gamer Avançado Eficiente (Zen 5)"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 65,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 94
    },
    {
      "id": "cpu-36-amd-ryzen-7-9800x3d",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 7 9800X3D",
      "resumoSpecs": "8C/16T · AM5 · 120W",
      "nome": "AMD Ryzen 7 9800X3D, 8C/16T, 4.7 / 5.2 GHz, AM5 — Gamer Extremo / Melhor para Jogos",
      "marca": "AMD",
      "preco": 2500,
      "imagem": "img/pecas/reais/cpu-amd-19-amd-ryzen-7-9800x3d.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 8C/16T · Frequência: 4.7 / 5.2 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 120W · Perfil: Gamer Extremo / Melhor para Jogos"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 120,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 94
    },
    {
      "id": "cpu-37-amd-ryzen-9-9900x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 9 9900X",
      "resumoSpecs": "12C/24T · AM5 · 120W",
      "nome": "AMD Ryzen 9 9900X, 12C/24T, 4.4 / 5.6 GHz, AM5 — Gamer High-End / Workstation",
      "marca": "AMD",
      "preco": 2200,
      "imagem": "img/pecas/reais/cpu-amd-20-amd-ryzen-9-9900x.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 12C/24T · Frequência: 4.4 / 5.6 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 120W · Perfil: Gamer High-End / Workstation"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 120,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-38-amd-ryzen-9-9950x",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 9 9950X",
      "resumoSpecs": "16C/32T · AM5 · 170W",
      "nome": "AMD Ryzen 9 9950X, 16C/32T, 4.3 / 5.7 GHz, AM5 — Workstation Extrema (Zen 5)",
      "marca": "AMD",
      "preco": 3500,
      "imagem": "img/pecas/reais/cpu-amd-21-amd-ryzen-9-9950x.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 16C/32T · Frequência: 4.3 / 5.7 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 170W · Perfil: Workstation Extrema (Zen 5)"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 170,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-39-amd-ryzen-9-9950x3d",
      "categoria": "cpu",
      "nomeCurto": "AMD Ryzen 9 9950X3D",
      "resumoSpecs": "16C/32T · AM5 · 170W",
      "nome": "AMD Ryzen 9 9950X3D, 16C/32T, 4.3 / 5.7 GHz, AM5 — Workstation Extrema (Zen 5)",
      "marca": "AMD",
      "preco": 3500,
      "imagem": "img/pecas/reais/cpu-amd-22-amd-ryzen-9-9950x3d.jpg",
      "especificacoes": [
        "Soquete: AM5 · Memória: DDR5",
        "Núcleos/Threads: 16C/32T · Frequência: 4.3 / 5.7 GHz",
        "Gráficos Integrados: AMD Radeon Graphics (RDNA 2, 2 CUs)",
        "TDP: 170W · Perfil: Workstation Extrema (Zen 5)"
      ],
      "soquete": "AM5",
      "tipoRamSuportada": "DDR5",
      "tdpWatts": 170,
      "possuiVideoIntegrado": true,
      "nivelCpu": 4,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-40-xeon-e5-2697a-v4",
      "categoria": "cpu",
      "nomeCurto": "Intel Xeon E5-2697A v4",
      "resumoSpecs": "16C/32T · LGA2011-3 · 145W",
      "nome": "Intel Xeon E5-2697A v4, 16C/32T, 2.6 GHz / 3.6 GHz, LGA 2011-3 (Servidor / Kit X99 (Broadwell-EP))",
      "marca": "Intel",
      "preco": 200,
      "imagem": "img/pecas/reais/cpu-xeon-1-xeon-e5-2697a-v4.jpg",
      "especificacoes": [
        "Soquete: LGA 2011-3 · Memória: DDR4",
        "Núcleos/Threads: 16C/32T · Frequência: 2.6 GHz / 3.6 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 145W · Perfil: Servidor / Kit X99 (Broadwell-EP)"
      ],
      "soquete": "LGA2011-3",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 145,
      "possuiVideoIntegrado": false,
      "nivelCpu": 1,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-41-xeon-e5-2680-v4",
      "categoria": "cpu",
      "nomeCurto": "Intel Xeon E5-2680 v4",
      "resumoSpecs": "14C/28T · LGA2011-3 · 120W",
      "nome": "Intel Xeon E5-2680 v4, 14C/28T, 2.4 GHz / 3.3 GHz, LGA 2011-3 (Servidor / Kit X99 (Broadwell-EP))",
      "marca": "Intel",
      "preco": 70,
      "imagem": "img/pecas/reais/cpu-xeon-2-xeon-e5-2680-v4.jpg",
      "especificacoes": [
        "Soquete: LGA 2011-3 · Memória: DDR4",
        "Núcleos/Threads: 14C/28T · Frequência: 2.4 GHz / 3.3 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 120W · Perfil: Servidor / Kit X99 (Broadwell-EP)"
      ],
      "soquete": "LGA2011-3",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 120,
      "possuiVideoIntegrado": false,
      "nivelCpu": 1,
      "pontuacaoMultitarefa": 99
    },
    {
      "id": "cpu-42-xeon-e5-2667-v4",
      "categoria": "cpu",
      "nomeCurto": "Intel Xeon E5-2667 v4",
      "resumoSpecs": "8C/16T · LGA2011-3 · 135W",
      "nome": "Intel Xeon E5-2667 v4, 8C/16T, 3.2 GHz / 3.6 GHz, LGA 2011-3 (Servidor / Jogos X99 (Frequência Alta))",
      "marca": "Intel",
      "preco": 150,
      "imagem": "img/pecas/reais/cpu-xeon-3-xeon-e5-2667-v4.jpg",
      "especificacoes": [
        "Soquete: LGA 2011-3 · Memória: DDR4",
        "Núcleos/Threads: 8C/16T · Frequência: 3.2 GHz / 3.6 GHz",
        "Gráficos Integrados: Não possui (Requer GPU)",
        "TDP: 135W · Perfil: Servidor / Jogos X99 (Frequência Alta)"
      ],
      "soquete": "LGA2011-3",
      "tipoRamSuportada": "DDR4",
      "tdpWatts": 135,
      "possuiVideoIntegrado": false,
      "nivelCpu": 1,
      "pontuacaoMultitarefa": 82
    }
  ],
  "placamae": [
    {
      "id": "mb-msi-a520m",
      "categoria": "placamae",
      "nomeCurto": "MSI A520M-A PRO",
      "resumoSpecs": "Micro-ATX · AM4 · DDR4",
      "nome": "Placa-Mãe MSI A520M-A PRO, AM4, Chipset A520, Micro-ATX, DDR4",
      "marca": "MSI",
      "preco": 389.9,
      "imagem": "img/pecas/reais/mb-2-a520m-a-pro-msi-a520-am4-matx-ddr4-2-1-3-1gb-lan.jpg",
      "especificacoes": [
        "Soquete: AM4 · Chipset A520 (PCIe 3.0)",
        "Memória: 2x DDR4 · 1x Slot M.2 NVMe",
        "Rede: 1Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "AM4",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-1-gigabyte-b450m-ds3h-v2",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte B450M DS3H V2",
      "resumoSpecs": "Micro-ATX · AM4 · DDR4",
      "nome": "Placa-Mãe Gigabyte B450M DS3H V2, AM4, Chipset B450, Micro-ATX, DDR4",
      "marca": "Gigabyte",
      "preco": 469.9,
      "imagem": "img/pecas/reais/mb-1-b450m-ds3h-v2-gigabyte-b450-am4-matx-ddr4-4-1-3-1gb-lan.jpg",
      "especificacoes": [
        "Soquete: AM4 · Chipset B450 (PCIe 3.0)",
        "Memória: 4x DDR4 · 1x Slot M.2 NVMe",
        "Rede: 1Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "AM4",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-3-gigabyte-h410m-h-v3",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte H410M H V3",
      "resumoSpecs": "Micro-ATX · LGA1200 · DDR4",
      "nome": "Placa-Mãe Gigabyte H410M H V3, LGA1200, Chipset H410, Micro-ATX, DDR4",
      "marca": "Gigabyte",
      "preco": 439.9,
      "imagem": "img/pecas/reais/mb-3-h410m-h-v3-gigabyte-h410-lga-1200-matx-ddr4-2-1-3-1gb-l.jpg",
      "especificacoes": [
        "Soquete: LGA1200 · Chipset H410 (PCIe 3.0)",
        "Memória: 2x DDR4 · 1x Slot M.2 NVMe",
        "Rede: 1Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "LGA1200",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-4-msi-b560m-pro-e",
      "categoria": "placamae",
      "nomeCurto": "MSI B560M PRO-E",
      "resumoSpecs": "Micro-ATX · LGA1200 · DDR4",
      "nome": "Placa-Mãe MSI B560M PRO-E, LGA1200, Chipset B560, Micro-ATX, DDR4",
      "marca": "MSI",
      "preco": 499.9,
      "imagem": "img/pecas/reais/mb-4-b560m-pro-e-msi-b560-lga-1200-matx-ddr4-2-1-4-1gb-lan.jpg",
      "especificacoes": [
        "Soquete: LGA1200 · Chipset B560 (PCIe 4.0)",
        "Memória: 2x DDR4 · 1x Slot M.2 NVMe",
        "Rede: 1Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "LGA1200",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-5-asus-prime-h610m-e-d4",
      "categoria": "placamae",
      "nomeCurto": "ASUS Prime H610M-E D4",
      "resumoSpecs": "Micro-ATX · LGA1700 · DDR4",
      "nome": "Placa-Mãe ASUS Prime H610M-E D4, LGA1700, Chipset H610, Micro-ATX, DDR4",
      "marca": "ASUS",
      "preco": 559.9,
      "imagem": "img/pecas/reais/mb-5-h610m-e-d4-asus-h610-lga-1700-matx-ddr4-2-1-4-1gb-lan.jpg",
      "especificacoes": [
        "Soquete: LGA1700 · Chipset H610 (PCIe 4.0)",
        "Memória: 2x DDR4 · 1x Slot M.2 NVMe",
        "Rede: 1Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-6-gigabyte-b550m-aorus-elite",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte B550M Aorus Elite",
      "resumoSpecs": "Micro-ATX · AM4 · DDR4",
      "nome": "Placa-Mãe Gigabyte B550M Aorus Elite, AM4, Chipset B550, Micro-ATX, DDR4",
      "marca": "Gigabyte",
      "preco": 749.9,
      "imagem": "img/pecas/reais/mb-6-b550m-aorus-elite-gigabyte-b550-am4-matx-ddr4-4-2-4-1gb.jpg",
      "especificacoes": [
        "Soquete: AM4 · Chipset B550 (PCIe 4.0)",
        "Memória: 4x DDR4 · 2x Slot M.2 NVMe",
        "Rede: 1Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "AM4",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-asus-b550m",
      "categoria": "placamae",
      "nomeCurto": "ASUS TUF Gaming B550M-Plus",
      "resumoSpecs": "Micro-ATX · AM4 · DDR4",
      "nome": "Placa-Mãe ASUS TUF Gaming B550M-Plus, AM4, Chipset B550, Micro-ATX, DDR4",
      "marca": "ASUS",
      "preco": 829.9,
      "imagem": "img/pecas/reais/mb-7-tuf-gaming-b550m-plus-asus-b550-am4-matx-ddr4-4-2-4-2-5.jpg",
      "especificacoes": [
        "Soquete: AM4 · Chipset B550 (PCIe 4.0)",
        "Memória: 4x DDR4 · 2x Slot M.2 NVMe",
        "Rede: 2.5Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "AM4",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-8-msi-mpg-b550-gaming-plus",
      "categoria": "placamae",
      "nomeCurto": "MSI MPG B550 Gaming Plus",
      "resumoSpecs": "ATX · AM4 · DDR4",
      "nome": "Placa-Mãe MSI MPG B550 Gaming Plus, AM4, Chipset B550, ATX, DDR4",
      "marca": "MSI",
      "preco": 899.9,
      "imagem": "img/pecas/reais/mb-8-mpg-b550-gaming-plus-msi-b550-am4-atx-ddr4-4-2-4-1gb-la.jpg",
      "especificacoes": [
        "Soquete: AM4 · Chipset B550 (PCIe 4.0)",
        "Memória: 4x DDR4 · 2x Slot M.2 NVMe",
        "Rede: 1Gb LAN",
        "Formato: ATX"
      ],
      "soquete": "AM4",
      "tipoRam": "DDR4",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-9-gigabyte-x570s-aorus-elite",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte X570S Aorus Elite",
      "resumoSpecs": "ATX · AM4 · DDR4",
      "nome": "Placa-Mãe Gigabyte X570S Aorus Elite, AM4, Chipset X570, ATX, DDR4",
      "marca": "Gigabyte",
      "preco": 1299.9,
      "imagem": "img/pecas/reais/mb-9-x570s-aorus-elite-gigabyte-x570-am4-atx-ddr4-4-3-4-2-5g.jpg",
      "especificacoes": [
        "Soquete: AM4 · Chipset X570 (PCIe 4.0)",
        "Memória: 4x DDR4 · 3x Slot M.2 NVMe",
        "Rede: 2.5Gb LAN",
        "Formato: ATX"
      ],
      "soquete": "AM4",
      "tipoRam": "DDR4",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-10-gigabyte-b760m-aorus-elite",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte B760M Aorus Elite",
      "resumoSpecs": "Micro-ATX · LGA1700 · DDR5",
      "nome": "Placa-Mãe Gigabyte B760M Aorus Elite, LGA1700, Chipset B760, Micro-ATX, DDR5",
      "marca": "Gigabyte",
      "preco": 1099.9,
      "imagem": "img/pecas/reais/mb-10-b760m-aorus-elite-gigabyte-b760-lga-1700-matx-ddr5-4-2-.jpg",
      "especificacoes": [
        "Soquete: LGA1700 · Chipset B760 (PCIe 4.0)",
        "Memória: 4x DDR5 · 2x Slot M.2 NVMe",
        "Rede: 2.5Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR5",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-11-asus-tuf-gaming-b760m-plus-d4",
      "categoria": "placamae",
      "nomeCurto": "ASUS TUF Gaming B760M-Plus D4",
      "resumoSpecs": "Micro-ATX · LGA1700 · DDR4",
      "nome": "Placa-Mãe ASUS TUF Gaming B760M-Plus D4, LGA1700, Chipset B760, Micro-ATX, DDR4",
      "marca": "ASUS",
      "preco": 999.9,
      "imagem": "img/pecas/reais/mb-11-tuf-gaming-b760m-plus-d4-asus-b760-lga-1700-matx-ddr4-4.jpg",
      "especificacoes": [
        "Soquete: LGA1700 · Chipset B760 (PCIe 5.0)",
        "Memória: 4x DDR4 · 2x Slot M.2 NVMe",
        "Rede: 2.5Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-12-msi-mag-b760-tomahawk-wifi",
      "categoria": "placamae",
      "nomeCurto": "MSI MAG B760 Tomahawk WiFi",
      "resumoSpecs": "ATX · LGA1700 · DDR5",
      "nome": "Placa-Mãe MSI MAG B760 Tomahawk WiFi, LGA1700, Chipset B760, ATX, DDR5",
      "marca": "MSI",
      "preco": 1399.9,
      "imagem": "img/pecas/reais/mb-12-mag-b760-tomahawk-wifi-msi-b760-lga-1700-atx-ddr5-4-3-5.jpg",
      "especificacoes": [
        "Soquete: LGA1700 · Chipset B760 (PCIe 5.0)",
        "Memória: 4x DDR5 · 3x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-13-msi-pro-z690-a-wifi",
      "categoria": "placamae",
      "nomeCurto": "MSI PRO Z690-A WiFi",
      "resumoSpecs": "ATX · LGA1700 · DDR5",
      "nome": "Placa-Mãe MSI PRO Z690-A WiFi, LGA1700, Chipset Z690, ATX, DDR5",
      "marca": "MSI",
      "preco": 1499.9,
      "imagem": "img/pecas/reais/mb-13-z690-a-pro-wifi-msi-z690-lga-1700-atx-ddr5-4-4-5-2-5gb-.jpg",
      "especificacoes": [
        "Soquete: LGA1700 · Chipset Z690 (PCIe 5.0)",
        "Memória: 4x DDR5 · 4x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-14-gigabyte-z790-aorus-elite-ax",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte Z790 Aorus Elite AX",
      "resumoSpecs": "ATX · LGA1700 · DDR5",
      "nome": "Placa-Mãe Gigabyte Z790 Aorus Elite AX, LGA1700, Chipset Z790, ATX, DDR5",
      "marca": "Gigabyte",
      "preco": 1899.9,
      "imagem": "img/pecas/reais/mb-14-z790-aorus-elite-ax-gigabyte-z790-lga-1700-atx-ddr5-4-4.jpg",
      "especificacoes": [
        "Soquete: LGA1700 · Chipset Z790 (PCIe 5.0)",
        "Memória: 4x DDR5 · 4x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-15-gigabyte-a620m-s2h",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte A620M S2H",
      "resumoSpecs": "Micro-ATX · AM5 · DDR5",
      "nome": "Placa-Mãe Gigabyte A620M S2H, AM5, Chipset A620, Micro-ATX, DDR5",
      "marca": "Gigabyte",
      "preco": 629.9,
      "imagem": "img/pecas/reais/mb-15-a620m-s2h-gigabyte-a620-am5-matx-ddr5-2-1-4-1gb-lan.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset A620 (PCIe 4.0)",
        "Memória: 2x DDR5 · 1x Slot M.2 NVMe",
        "Rede: 1Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "Micro-ATX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-16-asus-tuf-gaming-a620m-plus",
      "categoria": "placamae",
      "nomeCurto": "ASUS TUF Gaming A620M-Plus",
      "resumoSpecs": "Micro-ATX · AM5 · DDR5",
      "nome": "Placa-Mãe ASUS TUF Gaming A620M-Plus, AM5, Chipset A620, Micro-ATX, DDR5",
      "marca": "ASUS",
      "preco": 849.9,
      "imagem": "img/pecas/reais/mb-16-tuf-gaming-a620m-plus-asus-a620-am5-matx-ddr5-4-2-4-2-5.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset A620 (PCIe 4.0)",
        "Memória: 4x DDR5 · 2x Slot M.2 NVMe",
        "Rede: 2.5Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-17-msi-pro-b650m-p",
      "categoria": "placamae",
      "nomeCurto": "MSI PRO B650M-P",
      "resumoSpecs": "Micro-ATX · AM5 · DDR5",
      "nome": "Placa-Mãe MSI PRO B650M-P, AM5, Chipset B650, Micro-ATX, DDR5",
      "marca": "MSI",
      "preco": 899.9,
      "imagem": "img/pecas/reais/mb-17-pro-b650m-p-msi-b650-am5-matx-ddr5-4-2-4-2-5gb-lan.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset B650 (PCIe 4.0)",
        "Memória: 4x DDR5 · 2x Slot M.2 NVMe",
        "Rede: 2.5Gb LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-18-gigabyte-b650m-aorus-elite-ax",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte B650M Aorus Elite AX",
      "resumoSpecs": "Micro-ATX · AM5 · DDR5",
      "nome": "Placa-Mãe Gigabyte B650M Aorus Elite AX, AM5, Chipset B650, Micro-ATX, DDR5",
      "marca": "Gigabyte",
      "preco": 1349.9,
      "imagem": "img/pecas/reais/mb-18-b650m-aorus-elite-ax-gigabyte-b650-am5-matx-ddr5-4-2-4-.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset B650 (PCIe 4.0)",
        "Memória: 4x DDR5 · 2x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: Micro-ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-19-asus-rog-strix-b650e-f-gaming-wifi",
      "categoria": "placamae",
      "nomeCurto": "ASUS ROG Strix B650E-F Gaming WiFi",
      "resumoSpecs": "ATX · AM5 · DDR5",
      "nome": "Placa-Mãe ASUS ROG Strix B650E-F Gaming WiFi, AM5, Chipset B650E, ATX, DDR5",
      "marca": "ASUS",
      "preco": 1999.9,
      "imagem": "img/pecas/reais/mb-19-rog-strix-b650e-f-gaming-asus-b650e-am5-atx-ddr5-4-3-5-.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset B650E (PCIe 5.0)",
        "Memória: 4x DDR5 · 3x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-20-msi-mag-x670e-tomahawk-wifi",
      "categoria": "placamae",
      "nomeCurto": "MSI MAG X670E Tomahawk WiFi",
      "resumoSpecs": "ATX · AM5 · DDR5",
      "nome": "Placa-Mãe MSI MAG X670E Tomahawk WiFi, AM5, Chipset X670E, ATX, DDR5",
      "marca": "MSI",
      "preco": 2299.9,
      "imagem": "img/pecas/reais/mb-20-mag-x670e-tomahawk-wifi-msi-x670e-am5-atx-ddr5-4-4-5-2-.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset X670E (PCIe 5.0)",
        "Memória: 4x DDR5 · 4x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-21-gigabyte-x670e-aorus-master",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte X670E Aorus Master",
      "resumoSpecs": "ATX · AM5 · DDR5",
      "nome": "Placa-Mãe Gigabyte X670E Aorus Master, AM5, Chipset X670E, ATX, DDR5",
      "marca": "Gigabyte",
      "preco": 3199.9,
      "imagem": "img/pecas/reais/mb-21-x670e-aorus-master-gigabyte-x670e-am5-atx-ddr5-4-4-5-2-.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset X670E (PCIe 5.0)",
        "Memória: 4x DDR5 · 4x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-22-asus-rog-crosshair-x670e-hero",
      "categoria": "placamae",
      "nomeCurto": "ASUS ROG Crosshair X670E Hero",
      "resumoSpecs": "ATX · AM5 · DDR5",
      "nome": "Placa-Mãe ASUS ROG Crosshair X670E Hero, AM5, Chipset X670E, ATX, DDR5",
      "marca": "ASUS",
      "preco": 4299.9,
      "imagem": "img/pecas/reais/mb-22-rog-crosshair-x670e-hero-asus-x670e-am5-atx-ddr5-4-4-5-.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset X670E (PCIe 5.0)",
        "Memória: 4x DDR5 · 4x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-23-gigabyte-x870-aorus-elite-wifi7",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte X870 Aorus Elite WiFi7",
      "resumoSpecs": "ATX · AM5 · DDR5",
      "nome": "Placa-Mãe Gigabyte X870 Aorus Elite WiFi7, AM5, Chipset X870, ATX, DDR5",
      "marca": "Gigabyte",
      "preco": 2399.9,
      "imagem": "img/pecas/reais/mb-23-x870-aorus-elite-wifi7-gigabyte-x870-am5-atx-ddr5-4-3-5.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset X870 (PCIe 5.0)",
        "Memória: 4x DDR5 · 3x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 7",
        "Formato: ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-24-asus-rog-strix-x870e-e-gaming-wifi",
      "categoria": "placamae",
      "nomeCurto": "ASUS ROG Strix X870E-E Gaming WiFi",
      "resumoSpecs": "ATX · AM5 · DDR5",
      "nome": "Placa-Mãe ASUS ROG Strix X870E-E Gaming WiFi, AM5, Chipset X870E, ATX, DDR5",
      "marca": "ASUS",
      "preco": 3899.9,
      "imagem": "img/pecas/reais/mb-24-rog-strix-x870e-e-gaming-asus-x870e-am5-atx-ddr5-4-5-5-.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset X870E (PCIe 5.0)",
        "Memória: 4x DDR5 · 5x Slot M.2 NVMe",
        "Rede: 5Gb + Wi-Fi 7",
        "Formato: ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-25-msi-mpg-x870e-carbon-wifi",
      "categoria": "placamae",
      "nomeCurto": "MSI MPG X870E Carbon WiFi",
      "resumoSpecs": "ATX · AM5 · DDR5",
      "nome": "Placa-Mãe MSI MPG X870E Carbon WiFi, AM5, Chipset X870E, ATX, DDR5",
      "marca": "MSI",
      "preco": 3499.9,
      "imagem": "img/pecas/reais/mb-25-mpg-x870e-carbon-wifi-msi-x870e-am5-atx-ddr5-4-4-5-5gb-.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset X870E (PCIe 5.0)",
        "Memória: 4x DDR5 · 4x Slot M.2 NVMe",
        "Rede: 5Gb + Wi-Fi 7",
        "Formato: ATX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-26-gigabyte-z890-aorus-elite-wifi7",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte Z890 Aorus Elite WiFi7",
      "resumoSpecs": "ATX · LGA1851 · DDR5",
      "nome": "Placa-Mãe Gigabyte Z890 Aorus Elite WiFi7, LGA1851, Chipset Z890, ATX, DDR5",
      "marca": "Gigabyte",
      "preco": 2499.9,
      "imagem": "img/pecas/reais/mb-26-z890-aorus-elite-wifi7-gigabyte-z890-lga-1851-atx-ddr5-.jpg",
      "especificacoes": [
        "Soquete: LGA1851 · Chipset Z890 (PCIe 5.0)",
        "Memória: 4x DDR5 · 4x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 7",
        "Formato: ATX"
      ],
      "soquete": "LGA1851",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-27-asus-rog-maximus-z890-hero",
      "categoria": "placamae",
      "nomeCurto": "ASUS ROG Maximus Z890 Hero",
      "resumoSpecs": "ATX · LGA1851 · DDR5",
      "nome": "Placa-Mãe ASUS ROG Maximus Z890 Hero, LGA1851, Chipset Z890, ATX, DDR5",
      "marca": "ASUS",
      "preco": 4699.9,
      "imagem": "img/pecas/reais/mb-27-rog-maximus-z890-hero-asus-z890-lga-1851-atx-ddr5-4-5-5.jpg",
      "especificacoes": [
        "Soquete: LGA1851 · Chipset Z890 (PCIe 5.0)",
        "Memória: 4x DDR5 · 5x Slot M.2 NVMe",
        "Rede: 5Gb + Wi-Fi 7",
        "Formato: ATX"
      ],
      "soquete": "LGA1851",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-28-asus-rog-strix-b550-i-gaming",
      "categoria": "placamae",
      "nomeCurto": "ASUS ROG Strix B550-I Gaming",
      "resumoSpecs": "Mini-ITX · AM4 · DDR4",
      "nome": "Placa-Mãe ASUS ROG Strix B550-I Gaming, AM4, Chipset B550, Mini-ITX, DDR4",
      "marca": "ASUS",
      "preco": 1399.9,
      "imagem": "img/pecas/reais/mb-28-rog-strix-b550-i-gaming-asus-b550-am4-itx-ddr4-2-2-4-2-.jpg",
      "especificacoes": [
        "Soquete: AM4 · Chipset B550 (PCIe 4.0)",
        "Memória: 2x DDR4 · 2x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6",
        "Formato: Mini-ITX"
      ],
      "soquete": "AM4",
      "tipoRam": "DDR4",
      "formato": "Mini-ITX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-29-gigabyte-b650i-aorus-ultra",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte B650I Aorus Ultra",
      "resumoSpecs": "Mini-ITX · AM5 · DDR5",
      "nome": "Placa-Mãe Gigabyte B650I Aorus Ultra, AM5, Chipset B650, Mini-ITX, DDR5",
      "marca": "Gigabyte",
      "preco": 1899.9,
      "imagem": "img/pecas/reais/mb-29-b650i-aorus-ultra-gigabyte-b650-am5-itx-ddr5-2-3-4-2-5g.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset B650 (PCIe 4.0)",
        "Memória: 2x DDR5 · 3x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: Mini-ITX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "Mini-ITX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-30-gigabyte-x870i-aorus-pro-ice",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte X870I Aorus Pro Ice",
      "resumoSpecs": "Mini-ITX · AM5 · DDR5",
      "nome": "Placa-Mãe Gigabyte X870I Aorus Pro Ice, AM5, Chipset X870, Mini-ITX, DDR5",
      "marca": "Gigabyte",
      "preco": 2299.9,
      "imagem": "img/pecas/reais/mb-30-x870i-aorus-pro-gigabyte-x870-am5-itx-ddr5-2-2-5-2-5gb-.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset X870 (PCIe 5.0)",
        "Memória: 2x DDR5 · 2x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 7",
        "Formato: Mini-ITX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "Mini-ITX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-31-asrock-a620i-lightning-wifi",
      "categoria": "placamae",
      "nomeCurto": "ASRock A620I Lightning WiFi",
      "resumoSpecs": "Mini-ITX · AM5 · DDR5",
      "nome": "Placa-Mãe ASRock A620I Lightning WiFi, AM5, Chipset A620, Mini-ITX, DDR5",
      "marca": "ASRock",
      "preco": 1149.9,
      "imagem": "img/pecas/reais/mb-31-asrock-a620i-lightning-asrock-a620-am5-itx-ddr5-2-1-4-2.jpg",
      "especificacoes": [
        "Soquete: AM5 · Chipset A620 (PCIe 4.0)",
        "Memória: 2x DDR5 · 1x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: Mini-ITX"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "Mini-ITX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-32-asrock-b760m-steel-legend-wifi",
      "categoria": "placamae",
      "nomeCurto": "ASRock B760M Steel Legend WiFi",
      "resumoSpecs": "Micro-ATX · LGA1700 · DDR5",
      "nome": "Placa-Mãe ASRock B760M Steel Legend WiFi, LGA1700, Chipset B760, Micro-ATX, DDR5",
      "marca": "ASRock",
      "preco": 1199.9,
      "imagem": "img/pecas/reais/mb-32-asrock-b760m-steel-legend-asrock-b760-lga-1700-matx-ddr.jpg",
      "especificacoes": [
        "Soquete: LGA1700 · Chipset B760 (PCIe 5.0)",
        "Memória: 4x DDR5 · 3x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: Micro-ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR5",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-33-nzxt-n7-z790-matte-white-black",
      "categoria": "placamae",
      "nomeCurto": "NZXT N7 Z790 Matte White/Black",
      "resumoSpecs": "ATX · LGA1700 · DDR5",
      "nome": "Placa-Mãe NZXT N7 Z790 Matte White/Black, LGA1700, Chipset Z790, ATX, DDR5",
      "marca": "NZXT",
      "preco": 2199.9,
      "imagem": "img/pecas/reais/mb-33-nzxt-n7-z790-nzxt-z790-lga-1700-atx-ddr5-4-3-5-2-5gb-wi.jpg",
      "especificacoes": [
        "Soquete: LGA1700 · Chipset Z790 (PCIe 5.0)",
        "Memória: 4x DDR5 · 3x Slot M.2 NVMe",
        "Rede: 2.5Gb + Wi-Fi 6E",
        "Formato: ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-34-machinist-x99-pr9",
      "categoria": "placamae",
      "nomeCurto": "Machinist X99-PR9",
      "resumoSpecs": "Micro-ATX · LGA2011-3 · DDR4",
      "nome": "Placa-Mãe Machinist X99-PR9, LGA2011-3, Chipset B85/C226 (X99), Micro-ATX, DDR4",
      "marca": "Machinist",
      "preco": 349.9,
      "imagem": "img/pecas/reais/mb-34-x99-pr9-nanzhi-machinist-intel-b85c226-lga-2011-3-m-atx.jpg",
      "especificacoes": [
        "Soquete: LGA2011-3 · Chipset B85/C226 (X99) (PCIe 3.0)",
        "Memória: 4x DDR4 · 1x Slot M.2 NVMe",
        "Rede: Gigabit LAN",
        "Formato: Micro-ATX"
      ],
      "soquete": "LGA2011-3",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 4,
      "consumoWatts": 35
    },
    {
      "id": "mb-35-huananzhi-x99-bd4",
      "categoria": "placamae",
      "nomeCurto": "Huananzhi X99-BD4",
      "resumoSpecs": "ATX · LGA2011-3 · DDR4",
      "nome": "Placa-Mãe Huananzhi X99-BD4, LGA2011-3, Chipset B85/C226 (X99), ATX, DDR4",
      "marca": "Huananzhi",
      "preco": 489.9,
      "imagem": "img/pecas/reais/mb-35-x99-bd4-huananzhi-intel-b85c226-lga-2011-3-atx-ddr4-4-2.jpg",
      "especificacoes": [
        "Soquete: LGA2011-3 · Chipset B85/C226 (X99) (PCIe 3.0)",
        "Memória: 4x DDR4 · 2x Slot M.2 NVMe",
        "Rede: Gigabit LAN",
        "Formato: ATX"
      ],
      "soquete": "LGA2011-3",
      "tipoRam": "DDR4",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    },
    {
      "id": "mb-gigabyte-h610m",
      "categoria": "placamae",
      "nomeCurto": "Gigabyte H610M H V2",
      "resumoSpecs": "Micro-ATX · LGA1700 · DDR4",
      "nome": "Placa-Mãe Gigabyte H610M H V2, Intel LGA 1700, Micro-ATX, DDR4",
      "marca": "Gigabyte",
      "preco": 529.9,
      "imagem": "img/pecas/mb-msi-2.webp",
      "especificacoes": [
        "Soquete: LGA 1700 · Chipset H610",
        "Memória: 2x DDR4 (até 64GB)",
        "1x Slot M.2 NVMe + 4x SATA",
        "Formato: Micro-ATX"
      ],
      "soquete": "LGA1700",
      "tipoRam": "DDR4",
      "formato": "Micro-ATX",
      "slotsRam": 2,
      "consumoWatts": 35
    },
    {
      "id": "mb-msi-b650-atx",
      "categoria": "placamae",
      "nomeCurto": "MSI MAG B650 Tomahawk WiFi",
      "resumoSpecs": "ATX · AM5 · DDR5 · Wi-Fi 6E",
      "nome": "Placa-Mãe MSI MAG B650 Tomahawk WiFi, AMD AM5, ATX, DDR5",
      "marca": "MSI",
      "preco": 1549.9,
      "imagem": "img/pecas/mb-msi-2.webp",
      "especificacoes": [
        "Soquete: AM5 · Chipset B650",
        "Memória: 4x DDR5 (até 192GB)",
        "Wi-Fi 6E, LAN 2.5G, 3x M.2 NVMe",
        "Formato: ATX Padrão (Exige gabinete ATX)"
      ],
      "soquete": "AM5",
      "tipoRam": "DDR5",
      "formato": "ATX",
      "slotsRam": 4,
      "consumoWatts": 45
    }
  ],
  "ram": [
    {
      "id": "ram-16gb-ddr4",
      "categoria": "ram",
      "nomeCurto": "Kingston Fury Beast 16GB",
      "resumoSpecs": "2×8GB · DDR4 · 3200MHz CL16",
      "nome": "Memória Kingston Fury Beast 16GB, 16GB (2x8GB), 3200MHz, DDR4, CL16 Dual Channel",
      "marca": "Kingston",
      "preco": 329.9,
      "imagem": "img/pecas/reais/ram-3-fury-beast-kingston-ddr4-16gb-2x8gb-3200-mhz-cl16.jpg",
      "especificacoes": [
        "Capacidade: 16GB (2x8GB Dual Channel)",
        "Padrão: DDR4 · 3200MHz · Latência CL16",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR4",
      "capacidadeGb": 16,
      "modulos": 2,
      "frequenciaMhz": 3200,
      "consumoWatts": 10
    },
    {
      "id": "ram-1-kingston-valueram-8gb",
      "categoria": "ram",
      "nomeCurto": "Kingston ValueRAM 8GB",
      "resumoSpecs": "1×8GB · DDR4 · 2666MHz CL19",
      "nome": "Memória Kingston ValueRAM 8GB, 8GB (1x8GB), 2666MHz, DDR4, CL19 Single Channel",
      "marca": "Kingston",
      "preco": 139.9,
      "imagem": "img/pecas/reais/ram-1-valueram-kingston-ddr4-8gb-1x8gb-2666-mhz-cl19.jpg",
      "especificacoes": [
        "Capacidade: 8GB (1x8GB Single Channel)",
        "Padrão: DDR4 · 2666MHz · Latência CL19",
        "Módulo único (expansível para Dual Channel)"
      ],
      "tipoRam": "DDR4",
      "capacidadeGb": 8,
      "modulos": 1,
      "frequenciaMhz": 2666,
      "consumoWatts": 5
    },
    {
      "id": "ram-2-corsair-vengeance-lpx-16gb",
      "categoria": "ram",
      "nomeCurto": "Corsair Vengeance LPX 16GB",
      "resumoSpecs": "2×8GB · DDR4 · 3200MHz CL16",
      "nome": "Memória Corsair Vengeance LPX 16GB, 16GB (2x8GB), 3200MHz, DDR4, CL16 Dual Channel",
      "marca": "Corsair",
      "preco": 319.9,
      "imagem": "img/pecas/reais/ram-2-vengeance-corsair-ddr4-16gb-2x8gb-3200-mhz-cl16.jpg",
      "especificacoes": [
        "Capacidade: 16GB (2x8GB Dual Channel)",
        "Padrão: DDR4 · 3200MHz · Latência CL16",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR4",
      "capacidadeGb": 16,
      "modulos": 2,
      "frequenciaMhz": 3200,
      "consumoWatts": 10
    },
    {
      "id": "ram-4-xpg-gammix-d10-16gb",
      "categoria": "ram",
      "nomeCurto": "XPG Gammix D10 16GB",
      "resumoSpecs": "2×8GB · DDR4 · 3600MHz CL18",
      "nome": "Memória XPG Gammix D10 16GB, 16GB (2x8GB), 3600MHz, DDR4, CL18 Dual Channel",
      "marca": "XPG",
      "preco": 349.9,
      "imagem": "img/pecas/reais/ram-4-gammix-d10-xpg-ddr4-16gb-2x8gb-3600-mhz-cl18.jpg",
      "especificacoes": [
        "Capacidade: 16GB (2x8GB Dual Channel)",
        "Padrão: DDR4 · 3600MHz · Latência CL18",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR4",
      "capacidadeGb": 16,
      "modulos": 2,
      "frequenciaMhz": 3600,
      "consumoWatts": 10
    },
    {
      "id": "ram-5-corsair-vengeance-lpx-32gb-3200mhz",
      "categoria": "ram",
      "nomeCurto": "Corsair Vengeance LPX 32GB 3200MHz",
      "resumoSpecs": "2×16GB · DDR4 · 3200MHz CL16",
      "nome": "Memória Corsair Vengeance LPX 32GB 3200MHz, 32GB (2x16GB), 3200MHz, DDR4, CL16 Dual Channel",
      "marca": "Corsair",
      "preco": 549.9,
      "imagem": "img/pecas/reais/ram-5-vegeance-corsair-ddr4-32gb-2x16gb-3200-mhz-cl16.jpg",
      "especificacoes": [
        "Capacidade: 32GB (2x16GB Dual Channel)",
        "Padrão: DDR4 · 3200MHz · Latência CL16",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR4",
      "capacidadeGb": 32,
      "modulos": 2,
      "frequenciaMhz": 3200,
      "consumoWatts": 10
    },
    {
      "id": "ram-6-crucial-16gb-ddr5",
      "categoria": "ram",
      "nomeCurto": "Crucial 16GB DDR5",
      "resumoSpecs": "1×16GB · DDR5 · 4800MHz CL40",
      "nome": "Memória Crucial 16GB DDR5, 16GB (1x16GB), 4800MHz, DDR5, CL40 Single Channel",
      "marca": "Crucial",
      "preco": 389.9,
      "imagem": "img/pecas/reais/ram-6-crucial-ram-crucial-ddr5-16gb-1x16gb-4800-mhz-cl40.jpg",
      "especificacoes": [
        "Capacidade: 16GB (1x16GB Single Channel)",
        "Padrão: DDR5 · 4800MHz · Latência CL40",
        "Módulo único (expansível para Dual Channel)"
      ],
      "tipoRam": "DDR5",
      "capacidadeGb": 16,
      "modulos": 1,
      "frequenciaMhz": 4800,
      "consumoWatts": 5
    },
    {
      "id": "ram-7-corsair-vengeance-32gb-5200mhz",
      "categoria": "ram",
      "nomeCurto": "Corsair Vengeance 32GB 5200MHz",
      "resumoSpecs": "2×16GB · DDR5 · 5200MHz CL40",
      "nome": "Memória Corsair Vengeance 32GB 5200MHz, 32GB (2x16GB), 5200MHz, DDR5, CL40 Dual Channel",
      "marca": "Corsair",
      "preco": 749.9,
      "imagem": "img/pecas/reais/ram-7-vengeance-corsair-ddr5-32gb-2x16gb-5200-mhz-cl40.jpg",
      "especificacoes": [
        "Capacidade: 32GB (2x16GB Dual Channel)",
        "Padrão: DDR5 · 5200MHz · Latência CL40",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR5",
      "capacidadeGb": 32,
      "modulos": 2,
      "frequenciaMhz": 5200,
      "consumoWatts": 10
    },
    {
      "id": "ram-8-kingston-fury-beast-32gb-ddr5",
      "categoria": "ram",
      "nomeCurto": "Kingston Fury Beast 32GB DDR5",
      "resumoSpecs": "2×16GB · DDR5 · 5600MHz CL36",
      "nome": "Memória Kingston Fury Beast 32GB DDR5, 32GB (2x16GB), 5600MHz, DDR5, CL36 Dual Channel",
      "marca": "Kingston",
      "preco": 829.9,
      "imagem": "img/pecas/reais/ram-8-fury-beast-kingston-ddr5-32gb-2x16gb-5600-mhz-cl36.jpg",
      "especificacoes": [
        "Capacidade: 32GB (2x16GB Dual Channel)",
        "Padrão: DDR5 · 5600MHz · Latência CL36",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR5",
      "capacidadeGb": 32,
      "modulos": 2,
      "frequenciaMhz": 5600,
      "consumoWatts": 10
    },
    {
      "id": "ram-9-xpg-lancer-rgb-32gb-ddr5",
      "categoria": "ram",
      "nomeCurto": "XPG Lancer RGB 32GB DDR5",
      "resumoSpecs": "2×16GB · DDR5 · 6000MHz CL30",
      "nome": "Memória XPG Lancer RGB 32GB DDR5, 32GB (2x16GB), 6000MHz, DDR5, CL30 Dual Channel",
      "marca": "XPG",
      "preco": 949.9,
      "imagem": "img/pecas/reais/ram-9-lancer-rgb-xpg-ddr5-32gb-2x16gb-6000-mhz-cl30.jpg",
      "especificacoes": [
        "Capacidade: 32GB (2x16GB Dual Channel)",
        "Padrão: DDR5 · 6000MHz · Latência CL30",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR5",
      "capacidadeGb": 32,
      "modulos": 2,
      "frequenciaMhz": 6000,
      "consumoWatts": 10
    },
    {
      "id": "ram-10-corsair-dominator-titanium-32gb-ddr5",
      "categoria": "ram",
      "nomeCurto": "Corsair Dominator Titanium 32GB DDR5",
      "resumoSpecs": "2×16GB · DDR5 · 6600MHz CL32",
      "nome": "Memória Corsair Dominator Titanium 32GB DDR5, 32GB (2x16GB), 6600MHz, DDR5, CL32 Dual Channel",
      "marca": "Corsair",
      "preco": 1299.9,
      "imagem": "img/pecas/reais/ram-10-dominator-titanium-corsair-ddr5-32gb-2x16gb-6600-mhz-cl.jpg",
      "especificacoes": [
        "Capacidade: 32GB (2x16GB Dual Channel)",
        "Padrão: DDR5 · 6600MHz · Latência CL32",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR5",
      "capacidadeGb": 32,
      "modulos": 2,
      "frequenciaMhz": 6600,
      "consumoWatts": 10
    },
    {
      "id": "ram-11-g-skill-trident-z5-rgb-64gb-ddr5",
      "categoria": "ram",
      "nomeCurto": "G.Skill Trident Z5 RGB 64GB DDR5",
      "resumoSpecs": "2×32GB · DDR5 · 7200MHz CL34",
      "nome": "Memória G.Skill Trident Z5 RGB 64GB DDR5, 64GB (2x32GB), 7200MHz, DDR5, CL34 Dual Channel",
      "marca": "G.Skill",
      "preco": 2199.9,
      "imagem": "img/pecas/reais/ram-11-trident-z5-rgb-g-skill-ddr5-64gb-2x32gb-7200-mhz-cl34.jpg",
      "especificacoes": [
        "Capacidade: 64GB (2x32GB Dual Channel)",
        "Padrão: DDR5 · 7200MHz · Latência CL34",
        "Kit Dual Channel de alta largura de banda"
      ],
      "tipoRam": "DDR5",
      "capacidadeGb": 64,
      "modulos": 2,
      "frequenciaMhz": 7200,
      "consumoWatts": 10
    },
    {
      "id": "ram-8gb-ddr4",
      "categoria": "ram",
      "nomeCurto": "Kingston Fury Beast 8GB",
      "resumoSpecs": "1×8GB · DDR4 · 3200MHz CL16",
      "nome": "Memória Kingston Fury Beast, 8GB (1x8GB), 3200MHz, DDR4, CL16",
      "marca": "Kingston",
      "preco": 169.9,
      "imagem": "img/pecas/ram-fury.webp",
      "especificacoes": [
        "Capacidade: 8GB (1x8GB Single Channel)",
        "Padrão: DDR4 · 3200MHz · CL16",
        "Dissipador em alumínio preto"
      ],
      "tipoRam": "DDR4",
      "capacidadeGb": 8,
      "modulos": 1,
      "frequenciaMhz": 3200,
      "consumoWatts": 4
    },
    {
      "id": "ram-32gb-ddr4",
      "categoria": "ram",
      "nomeCurto": "Corsair Vengeance LPX 32GB",
      "resumoSpecs": "2×16GB · DDR4 · 3600MHz CL18",
      "nome": "Memória Corsair Vengeance LPX, 32GB (2x16GB), 3600MHz, DDR4, CL18",
      "marca": "Corsair",
      "preco": 589.9,
      "imagem": "img/pecas/ram-corsair.webp",
      "especificacoes": [
        "Capacidade: 32GB (2x16GB Dual Channel)",
        "Padrão: DDR4 · 3600MHz · CL18",
        "Indicada para AutoCAD e projetos pesados"
      ],
      "tipoRam": "DDR4",
      "capacidadeGb": 32,
      "modulos": 2,
      "frequenciaMhz": 3600,
      "consumoWatts": 10
    },
    {
      "id": "ram-32gb-ddr5",
      "categoria": "ram",
      "nomeCurto": "Corsair Vengeance 32GB DDR5",
      "resumoSpecs": "2×16GB · DDR5 · 6000MHz CL36",
      "nome": "Memória Corsair Vengeance, 32GB (2x16GB), 6000MHz, DDR5, CL36",
      "marca": "Corsair",
      "preco": 899.9,
      "imagem": "img/pecas/ram-corsair.webp",
      "especificacoes": [
        "Capacidade: 32GB (2x16GB Dual Channel)",
        "Padrão: DDR5 · 6000MHz · CL36",
        "Perfis AMD EXPO e Intel XMP 3.0"
      ],
      "tipoRam": "DDR5",
      "capacidadeGb": 32,
      "modulos": 2,
      "frequenciaMhz": 6000,
      "consumoWatts": 12
    }
  ],
  "gpu": [
    {
      "id": "gpu-integrada",
      "categoria": "gpu",
      "nomeCurto": "Vídeo Integrado (iGPU)",
      "resumoSpecs": "Sem placa dedicada · 0W",
      "nome": "Vídeo Integrado do Processador (Sem Placa de Vídeo Dedicada)",
      "marca": "Integrado",
      "preco": 0,
      "imagem": "img/pecas/cpu-ryzen5.webp",
      "especificacoes": [
        "Usa o gráfico integrado do processador",
        "Exige CPU com vídeo integrado (ex.: 4600G / 7600)",
        "Indicado para escritório e estudos"
      ],
      "requerVideoIntegradoCpu": true,
      "vramGb": 0,
      "comprimentoMm": 0,
      "consumoWatts": 0,
      "fonteRecomendadaWatts": 300,
      "nivelGpu": 0
    },
    {
      "id": "gpu-1-geforce-rtx-3050-6gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 3050 6GB",
      "resumoSpecs": "6GB GDDR6 · 70W · 205mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 3050 6GB, 6GB GDDR6, 70W (Nenhum (PCIe))",
      "marca": "NVIDIA",
      "preco": 1199.9,
      "imagem": "img/pecas/reais/gpu-1-geforce-rtx-3050-nvidia-6gb-gddr6-70w-nenhum.jpg",
      "especificacoes": [
        "Memória: 6GB GDDR6",
        "Comprimento: 205mm · Conector: Nenhum (PCIe)",
        "Consumo (TDP): 70W · Fonte mín.: 350W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 6,
      "comprimentoMm": 205,
      "consumoWatts": 70,
      "fonteRecomendadaWatts": 350,
      "nivelGpu": 1
    },
    {
      "id": "gpu-2-geforce-rtx-3060-12gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 3060 12GB",
      "resumoSpecs": "12GB GDDR6 · 170W · 242mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 3060 12GB, 12GB GDDR6, 170W (1x 8-pin)",
      "marca": "NVIDIA",
      "preco": 1699.9,
      "imagem": "img/pecas/reais/gpu-2-geforce-rtx-3060-nvidia-12gb-gddr6-170w-1x8-pin.jpg",
      "especificacoes": [
        "Memória: 12GB GDDR6",
        "Comprimento: 242mm · Conector: 1x 8-pin",
        "Consumo (TDP): 170W · Fonte mín.: 550W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 12,
      "comprimentoMm": 242,
      "consumoWatts": 170,
      "fonteRecomendadaWatts": 550,
      "nivelGpu": 2
    },
    {
      "id": "gpu-rtx4060",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 4060 8GB",
      "resumoSpecs": "8GB GDDR6 · 115W · 227mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 4060 8GB, 8GB GDDR6, 115W (1x 8-pin)",
      "marca": "NVIDIA",
      "preco": 2099.9,
      "imagem": "img/pecas/reais/gpu-3-geforce-rtx-4060-nvidia-8gb-gddr6-115w-1x8-pin.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR6",
        "Comprimento: 227mm · Conector: 1x 8-pin",
        "Consumo (TDP): 115W · Fonte mín.: 550W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 227,
      "consumoWatts": 115,
      "fonteRecomendadaWatts": 550,
      "nivelGpu": 2
    },
    {
      "id": "gpu-4-geforce-rtx-4060-ti-8gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 4060 Ti 8GB",
      "resumoSpecs": "8GB GDDR6 · 160W · 244mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 4060 Ti 8GB, 8GB GDDR6, 160W (1x 8-pin / 12V-2x6)",
      "marca": "NVIDIA",
      "preco": 2599.9,
      "imagem": "img/pecas/reais/gpu-4-geforce-rtx-4060-ti-nvidia-8gb-gddr6-160w-1x8-pin-12v-2.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR6",
        "Comprimento: 244mm · Conector: 1x 8-pin / 12V-2x6",
        "Consumo (TDP): 160W · Fonte mín.: 550W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 244,
      "consumoWatts": 160,
      "fonteRecomendadaWatts": 550,
      "nivelGpu": 3
    },
    {
      "id": "gpu-5-geforce-rtx-5050-8gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 5050 8GB",
      "resumoSpecs": "8GB GDDR7 · 100W · 215mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 5050 8GB, 8GB GDDR7, 100W (1x 8-pin)",
      "marca": "NVIDIA",
      "preco": 1799.9,
      "imagem": "img/pecas/reais/gpu-5-geforce-rtx-5050-nvidia-8gb-gddr7-100w-1x8-pin.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR7",
        "Comprimento: 215mm · Conector: 1x 8-pin",
        "Consumo (TDP): 100W · Fonte mín.: 450W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 215,
      "consumoWatts": 100,
      "fonteRecomendadaWatts": 450,
      "nivelGpu": 2
    },
    {
      "id": "gpu-6-geforce-rtx-5060-8gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 5060 8GB",
      "resumoSpecs": "8GB GDDR7 · 115W · 235mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 5060 8GB, 8GB GDDR7, 115W (12V-2x6)",
      "marca": "NVIDIA",
      "preco": 2399.9,
      "imagem": "img/pecas/reais/gpu-6-geforce-rtx-5060-nvidia-8gb-gddr7-115w-12v-2x6.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR7",
        "Comprimento: 235mm · Conector: 12V-2x6",
        "Consumo (TDP): 115W · Fonte mín.: 550W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 235,
      "consumoWatts": 115,
      "fonteRecomendadaWatts": 550,
      "nivelGpu": 3
    },
    {
      "id": "gpu-7-geforce-rtx-5060-ti-8gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 5060 Ti 8GB",
      "resumoSpecs": "8GB GDDR7 · 150W · 250mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 5060 Ti 8GB, 8GB GDDR7, 150W (12V-2x6)",
      "marca": "NVIDIA",
      "preco": 2999.9,
      "imagem": "img/pecas/reais/gpu-7-geforce-rtx-5060-ti-nvidia-8gb-gddr7-150w-12v-2x6.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR7",
        "Comprimento: 250mm · Conector: 12V-2x6",
        "Consumo (TDP): 150W · Fonte mín.: 600W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 250,
      "consumoWatts": 150,
      "fonteRecomendadaWatts": 600,
      "nivelGpu": 3
    },
    {
      "id": "gpu-8-geforce-rtx-5070-12gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 5070 12GB",
      "resumoSpecs": "12GB GDDR7 · 250W · 285mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 5070 12GB, 12GB GDDR7, 250W (12V-2x6)",
      "marca": "NVIDIA",
      "preco": 4199.9,
      "imagem": "img/pecas/reais/gpu-8-geforce-rtx-5070-nvidia-12gb-gddr7-250w-12v-2x6.jpg",
      "especificacoes": [
        "Memória: 12GB GDDR7",
        "Comprimento: 285mm · Conector: 12V-2x6",
        "Consumo (TDP): 250W · Fonte mín.: 650W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 12,
      "comprimentoMm": 285,
      "consumoWatts": 250,
      "fonteRecomendadaWatts": 650,
      "nivelGpu": 4
    },
    {
      "id": "gpu-9-geforce-rtx-5070-ti-16gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 5070 Ti 16GB",
      "resumoSpecs": "16GB GDDR7 · 300W · 305mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 5070 Ti 16GB, 16GB GDDR7, 300W (12V-2x6)",
      "marca": "NVIDIA",
      "preco": 5699.9,
      "imagem": "img/pecas/reais/gpu-9-geforce-rtx-5070-ti-nvidia-16gb-gddr7-300w-12v-2x6.jpg",
      "especificacoes": [
        "Memória: 16GB GDDR7",
        "Comprimento: 305mm · Conector: 12V-2x6",
        "Consumo (TDP): 300W · Fonte mín.: 750W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 16,
      "comprimentoMm": 305,
      "consumoWatts": 300,
      "fonteRecomendadaWatts": 750,
      "nivelGpu": 5
    },
    {
      "id": "gpu-10-geforce-rtx-5080-16gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 5080 16GB",
      "resumoSpecs": "16GB GDDR7 · 400W · 330mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 5080 16GB, 16GB GDDR7, 400W (12V-2x6)",
      "marca": "NVIDIA",
      "preco": 7999.9,
      "imagem": "img/pecas/reais/gpu-10-geforce-rtx-5080-nvidia-16gb-gddr7-400w-12v-2x6.jpg",
      "especificacoes": [
        "Memória: 16GB GDDR7",
        "Comprimento: 330mm · Conector: 12V-2x6",
        "Consumo (TDP): 400W · Fonte mín.: 850W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 16,
      "comprimentoMm": 330,
      "consumoWatts": 400,
      "fonteRecomendadaWatts": 850,
      "nivelGpu": 5
    },
    {
      "id": "gpu-11-geforce-rtx-5090-32gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce RTX 5090 32GB",
      "resumoSpecs": "32GB GDDR7 · 575W · 348mm",
      "nome": "Placa de Vídeo NVIDIA GeForce RTX 5090 32GB, 32GB GDDR7, 575W (12V-2x6)",
      "marca": "NVIDIA",
      "preco": 14999.9,
      "imagem": "img/pecas/reais/gpu-11-geforce-rtx-5090-nvidia-32gb-gddr7-575w-12v-2x6.jpg",
      "especificacoes": [
        "Memória: 32GB GDDR7",
        "Comprimento: 348mm · Conector: 12V-2x6",
        "Consumo (TDP): 575W · Fonte mín.: 1000W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 32,
      "comprimentoMm": 348,
      "consumoWatts": 575,
      "fonteRecomendadaWatts": 1000,
      "nivelGpu": 5
    },
    {
      "id": "gpu-rx6600",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 6600 8GB",
      "resumoSpecs": "8GB GDDR6 · 132W · 269mm",
      "nome": "Placa de Vídeo AMD Radeon RX 6600 8GB, 8GB GDDR6, 132W (1x 8-pin)",
      "marca": "AMD",
      "preco": 1399.9,
      "imagem": "img/pecas/reais/gpu-12-radeon-rx-6600-amd-8gb-gddr6-132w-1x8-pin.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR6",
        "Comprimento: 269mm · Conector: 1x 8-pin",
        "Consumo (TDP): 132W · Fonte mín.: 500W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 269,
      "consumoWatts": 132,
      "fonteRecomendadaWatts": 500,
      "nivelGpu": 1
    },
    {
      "id": "gpu-13-radeon-rx-7600-8gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 7600 8GB",
      "resumoSpecs": "8GB GDDR6 · 165W · 240mm",
      "nome": "Placa de Vídeo AMD Radeon RX 7600 8GB, 8GB GDDR6, 165W (1x 8-pin)",
      "marca": "AMD",
      "preco": 1699.9,
      "imagem": "img/pecas/reais/gpu-13-radeon-rx-7600-amd-8gb-gddr6-165w-1x8-pin.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR6",
        "Comprimento: 240mm · Conector: 1x 8-pin",
        "Consumo (TDP): 165W · Fonte mín.: 550W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 240,
      "consumoWatts": 165,
      "fonteRecomendadaWatts": 550,
      "nivelGpu": 2
    },
    {
      "id": "gpu-14-radeon-rx-7600-xt-16gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 7600 XT 16GB",
      "resumoSpecs": "16GB GDDR6 · 190W · 250mm",
      "nome": "Placa de Vídeo AMD Radeon RX 7600 XT 16GB, 16GB GDDR6, 190W (2x 8-pin)",
      "marca": "AMD",
      "preco": 2199.9,
      "imagem": "img/pecas/reais/gpu-14-radeon-rx-7600-xt-amd-16gb-gddr6-190w-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 16GB GDDR6",
        "Comprimento: 250mm · Conector: 2x 8-pin",
        "Consumo (TDP): 190W · Fonte mín.: 600W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 16,
      "comprimentoMm": 250,
      "consumoWatts": 190,
      "fonteRecomendadaWatts": 600,
      "nivelGpu": 2
    },
    {
      "id": "gpu-rx7700xt",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 7700 XT 12GB",
      "resumoSpecs": "12GB GDDR6 · 245W · 280mm",
      "nome": "Placa de Vídeo AMD Radeon RX 7700 XT 12GB, 12GB GDDR6, 245W (2x 8-pin)",
      "marca": "AMD",
      "preco": 3099.9,
      "imagem": "img/pecas/reais/gpu-15-radeon-rx-7700-xt-amd-12gb-gddr6-245w-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 12GB GDDR6",
        "Comprimento: 280mm · Conector: 2x 8-pin",
        "Consumo (TDP): 245W · Fonte mín.: 650W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 12,
      "comprimentoMm": 280,
      "consumoWatts": 245,
      "fonteRecomendadaWatts": 650,
      "nivelGpu": 3
    },
    {
      "id": "gpu-16-radeon-rx-7900-xt-20gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 7900 XT 20GB",
      "resumoSpecs": "20GB GDDR6 · 315W · 312mm",
      "nome": "Placa de Vídeo AMD Radeon RX 7900 XT 20GB, 20GB GDDR6, 315W (2x 8-pin)",
      "marca": "AMD",
      "preco": 5299.9,
      "imagem": "img/pecas/reais/gpu-16-radeon-rx-7900-xt-amd-20gb-gddr6-315w-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 20GB GDDR6",
        "Comprimento: 312mm · Conector: 2x 8-pin",
        "Consumo (TDP): 315W · Fonte mín.: 750W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 20,
      "comprimentoMm": 312,
      "consumoWatts": 315,
      "fonteRecomendadaWatts": 750,
      "nivelGpu": 5
    },
    {
      "id": "gpu-17-intel-arc-a750-8gb",
      "categoria": "gpu",
      "nomeCurto": "Intel Intel Arc A750 8GB",
      "resumoSpecs": "8GB GDDR6 · 225W · 268mm",
      "nome": "Placa de Vídeo Intel Intel Arc A750 8GB, 8GB GDDR6, 225W (1x 8-pin + 1x 6-pin)",
      "marca": "Intel",
      "preco": 1349.9,
      "imagem": "img/pecas/reais/gpu-17-intel-arc-a750-intel-8gb-gddr6-225w-1x8-pin-1x6-pin.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR6",
        "Comprimento: 268mm · Conector: 1x 8-pin + 1x 6-pin",
        "Consumo (TDP): 225W · Fonte mín.: 600W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 268,
      "consumoWatts": 225,
      "fonteRecomendadaWatts": 600,
      "nivelGpu": 1
    },
    {
      "id": "gpu-18-intel-arc-b580-12gb",
      "categoria": "gpu",
      "nomeCurto": "Intel Intel Arc B580 12GB",
      "resumoSpecs": "12GB GDDR6 · 190W · 260mm",
      "nome": "Placa de Vídeo Intel Intel Arc B580 12GB, 12GB GDDR6, 190W (2x 8-pin)",
      "marca": "Intel",
      "preco": 1899.9,
      "imagem": "img/pecas/reais/gpu-18-intel-arc-b580-intel-12gb-gddr6-190w-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 12GB GDDR6",
        "Comprimento: 260mm · Conector: 2x 8-pin",
        "Consumo (TDP): 190W · Fonte mín.: 600W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 12,
      "comprimentoMm": 260,
      "consumoWatts": 190,
      "fonteRecomendadaWatts": 600,
      "nivelGpu": 2
    },
    {
      "id": "gpu-19-geforce-gtx-1650-4gb",
      "categoria": "gpu",
      "nomeCurto": "NVIDIA GeForce GTX 1650 4GB",
      "resumoSpecs": "4GB GDDR6 · 75W · 190mm",
      "nome": "Placa de Vídeo NVIDIA GeForce GTX 1650 4GB, 4GB GDDR6, 75W (Nenhum (PCIe))",
      "marca": "NVIDIA",
      "preco": 849.9,
      "imagem": "img/pecas/reais/gpu-19-geforce-gtx-1650-nvidia-4gb-gddr6-75w-nenhum.jpg",
      "especificacoes": [
        "Memória: 4GB GDDR6",
        "Comprimento: 190mm · Conector: Nenhum (PCIe)",
        "Consumo (TDP): 75W · Fonte mín.: 350W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 4,
      "comprimentoMm": 190,
      "consumoWatts": 75,
      "fonteRecomendadaWatts": 350,
      "nivelGpu": 1
    },
    {
      "id": "gpu-20-radeon-rx-6400-4gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 6400 4GB",
      "resumoSpecs": "4GB GDDR6 · 53W · 185mm",
      "nome": "Placa de Vídeo AMD Radeon RX 6400 4GB, 4GB GDDR6, 53W (Nenhum (PCIe))",
      "marca": "AMD",
      "preco": 799.9,
      "imagem": "img/pecas/reais/gpu-20-radeon-rx-6400-amd-4gb-gddr6-53w-nenhum.jpg",
      "especificacoes": [
        "Memória: 4GB GDDR6",
        "Comprimento: 185mm · Conector: Nenhum (PCIe)",
        "Consumo (TDP): 53W · Fonte mín.: 350W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 4,
      "comprimentoMm": 185,
      "consumoWatts": 53,
      "fonteRecomendadaWatts": 350,
      "nivelGpu": 1
    },
    {
      "id": "gpu-21-radeon-rx-9050-8gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 9050 8GB",
      "resumoSpecs": "8GB GDDR6 · 110W · 215mm",
      "nome": "Placa de Vídeo AMD Radeon RX 9050 8GB, 8GB GDDR6, 110W (1x 8-pin)",
      "marca": "AMD",
      "preco": 1499.9,
      "imagem": "img/pecas/reais/gpu-21-radeon-rx-9050-amd-8gb-gddr6-110w-1x8-pin.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR6",
        "Comprimento: 215mm · Conector: 1x 8-pin",
        "Consumo (TDP): 110W · Fonte mín.: 450W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 215,
      "consumoWatts": 110,
      "fonteRecomendadaWatts": 450,
      "nivelGpu": 2
    },
    {
      "id": "gpu-22-radeon-rx-9060-xt-8gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 9060 XT 8GB",
      "resumoSpecs": "8GB GDDR6 · 190W · 245mm",
      "nome": "Placa de Vídeo AMD Radeon RX 9060 XT 8GB, 8GB GDDR6, 190W (1x 8-pin / 2x 8-pin)",
      "marca": "AMD",
      "preco": 2199.9,
      "imagem": "img/pecas/reais/gpu-22-radeon-rx-9060-xt-amd-8gb-gddr6-190w-1x8-pin-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR6",
        "Comprimento: 245mm · Conector: 1x 8-pin / 2x 8-pin",
        "Consumo (TDP): 190W · Fonte mín.: 550W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 245,
      "consumoWatts": 190,
      "fonteRecomendadaWatts": 550,
      "nivelGpu": 3
    },
    {
      "id": "gpu-23-radeon-rx-9060-xt-16gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 9060 XT 16GB",
      "resumoSpecs": "16GB GDDR6 · 190W · 260mm",
      "nome": "Placa de Vídeo AMD Radeon RX 9060 XT 16GB, 16GB GDDR6, 190W (1x 8-pin / 2x 8-pin)",
      "marca": "AMD",
      "preco": 2699.9,
      "imagem": "img/pecas/reais/gpu-23-radeon-rx-9060-xt-amd-16gb-gddr6-190w-1x8-pin-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 16GB GDDR6",
        "Comprimento: 260mm · Conector: 1x 8-pin / 2x 8-pin",
        "Consumo (TDP): 190W · Fonte mín.: 600W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 16,
      "comprimentoMm": 260,
      "consumoWatts": 190,
      "fonteRecomendadaWatts": 600,
      "nivelGpu": 3
    },
    {
      "id": "gpu-24-radeon-rx-9070-gre-12gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 9070 GRE 12GB",
      "resumoSpecs": "12GB GDDR6 · 210W · 275mm",
      "nome": "Placa de Vídeo AMD Radeon RX 9070 GRE 12GB, 12GB GDDR6, 210W (2x 8-pin)",
      "marca": "AMD",
      "preco": 3499.9,
      "imagem": "img/pecas/reais/gpu-24-radeon-rx-9070-gre-amd-12gb-gddr6-210w-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 12GB GDDR6",
        "Comprimento: 275mm · Conector: 2x 8-pin",
        "Consumo (TDP): 210W · Fonte mín.: 650W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 12,
      "comprimentoMm": 275,
      "consumoWatts": 210,
      "fonteRecomendadaWatts": 650,
      "nivelGpu": 4
    },
    {
      "id": "gpu-25-radeon-rx-9070-16gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 9070 16GB",
      "resumoSpecs": "16GB GDDR6 · 240W · 285mm",
      "nome": "Placa de Vídeo AMD Radeon RX 9070 16GB, 16GB GDDR6, 240W (2x 8-pin)",
      "marca": "AMD",
      "preco": 4199.9,
      "imagem": "img/pecas/reais/gpu-25-radeon-rx-9070-amd-16gb-gddr6-240w-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 16GB GDDR6",
        "Comprimento: 285mm · Conector: 2x 8-pin",
        "Consumo (TDP): 240W · Fonte mín.: 650W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 16,
      "comprimentoMm": 285,
      "consumoWatts": 240,
      "fonteRecomendadaWatts": 650,
      "nivelGpu": 4
    },
    {
      "id": "gpu-26-radeon-rx-9070-xt-16gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 9070 XT 16GB",
      "resumoSpecs": "16GB GDDR6 · 280W · 300mm",
      "nome": "Placa de Vídeo AMD Radeon RX 9070 XT 16GB, 16GB GDDR6, 280W (2x 8-pin)",
      "marca": "AMD",
      "preco": 4899.9,
      "imagem": "img/pecas/reais/gpu-26-radeon-rx-9070-xt-amd-16gb-gddr6-280w-2x8-pin.jpg",
      "especificacoes": [
        "Memória: 16GB GDDR6",
        "Comprimento: 300mm · Conector: 2x 8-pin",
        "Consumo (TDP): 280W · Fonte mín.: 750W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 16,
      "comprimentoMm": 300,
      "consumoWatts": 280,
      "fonteRecomendadaWatts": 750,
      "nivelGpu": 5
    },
    {
      "id": "gpu-27-radeon-rx-580-8gb",
      "categoria": "gpu",
      "nomeCurto": "AMD Radeon RX 580 8GB",
      "resumoSpecs": "8GB GDDR5 · 185W · 230mm",
      "nome": "Placa de Vídeo AMD Radeon RX 580 8GB, 8GB GDDR5, 185W (1x 6-pin / 8-pin)",
      "marca": "AMD",
      "preco": 699.9,
      "imagem": "img/pecas/reais/gpu-27-rx-580-amd-8gb-gddr5-185w-6-pin.jpg",
      "especificacoes": [
        "Memória: 8GB GDDR5",
        "Comprimento: 230mm · Conector: 1x 6-pin / 8-pin",
        "Consumo (TDP): 185W · Fonte mín.: 500W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 8,
      "comprimentoMm": 230,
      "consumoWatts": 185,
      "fonteRecomendadaWatts": 500,
      "nivelGpu": 1
    },
    {
      "id": "gpu-rtx4070s",
      "categoria": "gpu",
      "nomeCurto": "Gigabyte RTX 4070 Super 12GB",
      "resumoSpecs": "12GB GDDR6X · Triple Fan · 261mm",
      "nome": "Placa de Vídeo Gigabyte GeForce RTX 4070 Super Windforce OC, 12GB GDDR6X",
      "marca": "Gigabyte",
      "preco": 4299.9,
      "imagem": "img/pecas/gpu-rtx-triple.webp",
      "especificacoes": [
        "Memória: 12GB GDDR6X · Quad HD Ultra & CAD 3D",
        "Comprimento: 261mm · Triple Fan",
        "Consumo: 220W · Fonte mín.: 650W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 12,
      "comprimentoMm": 261,
      "consumoWatts": 220,
      "fonteRecomendadaWatts": 650,
      "nivelGpu": 4
    },
    {
      "id": "gpu-rtx4080s",
      "categoria": "gpu",
      "nomeCurto": "ASUS TUF RTX 4080 Super 16GB",
      "resumoSpecs": "16GB GDDR6X · Triple Fan · 348mm",
      "nome": "Placa de Vídeo ASUS TUF Gaming GeForce RTX 4080 Super, 16GB GDDR6X",
      "marca": "ASUS",
      "preco": 6899.9,
      "imagem": "img/pecas/gpu-rtx-triple.webp",
      "especificacoes": [
        "Memória: 16GB GDDR6X · 1440p/4K Ultra",
        "Comprimento: 348mm (Exige gabinete > 350mm)",
        "Consumo: 320W · Fonte mín.: 750W"
      ],
      "requerVideoIntegradoCpu": false,
      "vramGb": 16,
      "comprimentoMm": 348,
      "consumoWatts": 320,
      "fonteRecomendadaWatts": 750,
      "nivelGpu": 5
    }
  ],
  "armazenamento": [
    {
      "id": "ssd-sata-480gb",
      "categoria": "armazenamento",
      "nomeCurto": "Kingston A400 480GB SATA",
      "resumoSpecs": "2.5\" SATA III · 500MB/s",
      "nome": "Kingston A400 480GB SATA, 480GB, 2.5\" SATA III, Leitura 500MB/s, Gravação 450MB/s",
      "marca": "Kingston",
      "preco": 229.9,
      "imagem": "img/pecas/reais/storage-3-ssd-sata-2-5-a400-kingston-480gb-sata-iii-500450-mbs-16.jpg",
      "especificacoes": [
        "Capacidade: 480GB · 2.5\" SATA III",
        "Leitura: 500MB/s · Gravação: 450MB/s",
        "Durabilidade: 160 TBW"
      ],
      "capacidadeGb": 480,
      "tipoInterface": "SATA",
      "leituraMbs": 500,
      "consumoWatts": 5
    },
    {
      "id": "ssd-nvme-500gb",
      "categoria": "armazenamento",
      "nomeCurto": "Kingston NV2 500GB",
      "resumoSpecs": "M.2 NVMe · PCIe 4.0 · 3500MB/s",
      "nome": "SSD Kingston NV2, 500GB, M.2 NVMe PCIe 4.0, Leitura 3500MB/s",
      "marca": "Kingston",
      "preco": 279.9,
      "imagem": "img/pecas/ssd-nvme.webp",
      "especificacoes": [
        "Capacidade: 500GB · M.2 2280 NVMe",
        "Leitura: 3500MB/s · Gravação: 2100MB/s",
        "Instalação direta no slot M.2"
      ],
      "capacidadeGb": 500,
      "tipoInterface": "NVMe",
      "leituraMbs": 3500,
      "consumoWatts": 5
    },
    {
      "id": "storage-1-seagate-skyhawk-1tb-hdd",
      "categoria": "armazenamento",
      "nomeCurto": "Seagate SkyHawk 1TB HDD",
      "resumoSpecs": "HDD 3.5\" SATA III 7200 RPM · 180MB/s",
      "nome": "Seagate SkyHawk 1TB HDD, 1TB, HDD 3.5\" SATA III 7200 RPM, Leitura 180MB/s, Gravação 180MB/s",
      "marca": "Seagate",
      "preco": 289.9,
      "imagem": "img/pecas/reais/storage-1-hdd-3-5-skyhawk-seagate-1tb-sata-iii-7200-rpm.jpg",
      "especificacoes": [
        "Capacidade: 1TB · HDD 3.5\" SATA III 7200 RPM",
        "Leitura: 180MB/s · Gravação: 180MB/s",
        "Durabilidade: 180 TB/ano"
      ],
      "capacidadeGb": 1000,
      "tipoInterface": "SATA",
      "leituraMbs": 180,
      "consumoWatts": 5
    },
    {
      "id": "storage-2-seagate-barracuda-2tb-hdd",
      "categoria": "armazenamento",
      "nomeCurto": "Seagate BarraCuda 2TB HDD",
      "resumoSpecs": "HDD 3.5\" SATA III 7200 RPM · 220MB/s",
      "nome": "Seagate BarraCuda 2TB HDD, 2TB, HDD 3.5\" SATA III 7200 RPM, Leitura 220MB/s, Gravação 220MB/s",
      "marca": "Seagate",
      "preco": 399.9,
      "imagem": "img/pecas/reais/storage-2-hdd-3-5-barracuda-seagate-2tb-sata-iii-7200-rpm.jpg",
      "especificacoes": [
        "Capacidade: 2TB · HDD 3.5\" SATA III 7200 RPM",
        "Leitura: 220MB/s · Gravação: 220MB/s",
        "Durabilidade: 240 TBW"
      ],
      "capacidadeGb": 2000,
      "tipoInterface": "SATA",
      "leituraMbs": 220,
      "consumoWatts": 5
    },
    {
      "id": "storage-4-crucial-mx500-1tb-sata",
      "categoria": "armazenamento",
      "nomeCurto": "Crucial MX500 1TB SATA",
      "resumoSpecs": "2.5\" SATA III · 560MB/s",
      "nome": "Crucial MX500 1TB SATA, 1TB, 2.5\" SATA III, Leitura 560MB/s, Gravação 510MB/s",
      "marca": "Crucial",
      "preco": 469.9,
      "imagem": "img/pecas/reais/storage-4-ssd-sata-2-5-mx500-crucial-1tb-sata-iii-560510-mbs-360-.jpg",
      "especificacoes": [
        "Capacidade: 1TB · 2.5\" SATA III",
        "Leitura: 560MB/s · Gravação: 510MB/s",
        "Durabilidade: 360 TBW"
      ],
      "capacidadeGb": 1000,
      "tipoInterface": "SATA",
      "leituraMbs": 560,
      "consumoWatts": 5
    },
    {
      "id": "storage-5-crucial-bx500-2tb-sata",
      "categoria": "armazenamento",
      "nomeCurto": "Crucial BX500 2TB SATA",
      "resumoSpecs": "2.5\" SATA III · 540MB/s",
      "nome": "Crucial BX500 2TB SATA, 2TB, 2.5\" SATA III, Leitura 540MB/s, Gravação 500MB/s",
      "marca": "Crucial",
      "preco": 799.9,
      "imagem": "img/pecas/reais/storage-5-ssd-sata-2-5-bx500-crucial-2tb-sata-iii-540500-mbs-1200.jpg",
      "especificacoes": [
        "Capacidade: 2TB · 2.5\" SATA III",
        "Leitura: 540MB/s · Gravação: 500MB/s",
        "Durabilidade: 1200 TBW"
      ],
      "capacidadeGb": 2000,
      "tipoInterface": "SATA",
      "leituraMbs": 540,
      "consumoWatts": 5
    },
    {
      "id": "ssd-nvme-1tb",
      "categoria": "armazenamento",
      "nomeCurto": "Kingston NV2 1TB NVMe",
      "resumoSpecs": "M.2 NVMe PCIe 4.0 · 6000MB/s",
      "nome": "Kingston NV2 1TB NVMe, 1TB, M.2 NVMe PCIe 4.0, Leitura 6000MB/s, Gravação 4000MB/s",
      "marca": "Kingston",
      "preco": 429.9,
      "imagem": "img/pecas/reais/storage-6-ssd-nvme-m-2-nv2-kingston-1tb-pcie-4-0-g3-perf-60004000.jpg",
      "especificacoes": [
        "Capacidade: 1TB · M.2 NVMe PCIe 4.0",
        "Leitura: 6000MB/s · Gravação: 4000MB/s",
        "Durabilidade: 320 TBW"
      ],
      "capacidadeGb": 1000,
      "tipoInterface": "NVMe",
      "leituraMbs": 6000,
      "consumoWatts": 7
    },
    {
      "id": "storage-7-kingston-nv3-2tb-nvme",
      "categoria": "armazenamento",
      "nomeCurto": "Kingston NV3 2TB NVMe",
      "resumoSpecs": "M.2 NVMe PCIe 4.0 · 6000MB/s",
      "nome": "Kingston NV3 2TB NVMe, 2TB, M.2 NVMe PCIe 4.0, Leitura 6000MB/s, Gravação 4000MB/s",
      "marca": "Kingston",
      "preco": 849.9,
      "imagem": "img/pecas/reais/storage-7-ssd-nvme-m-3-nv3-kingston-2tb-pcie-4-0-g3-perf-60004000.jpg",
      "especificacoes": [
        "Capacidade: 2TB · M.2 NVMe PCIe 4.0",
        "Leitura: 6000MB/s · Gravação: 4000MB/s",
        "Durabilidade: 321 TBW"
      ],
      "capacidadeGb": 2000,
      "tipoInterface": "NVMe",
      "leituraMbs": 6000,
      "consumoWatts": 7
    },
    {
      "id": "storage-8-samsung-980-pro-1tb-nvme",
      "categoria": "armazenamento",
      "nomeCurto": "Samsung 980 PRO 1TB NVMe",
      "resumoSpecs": "M.2 NVMe PCIe 4.0 · 7000MB/s",
      "nome": "Samsung 980 PRO 1TB NVMe, 1TB, M.2 NVMe PCIe 4.0, Leitura 7000MB/s, Gravação 5000MB/s",
      "marca": "Samsung",
      "preco": 699.9,
      "imagem": "img/pecas/reais/storage-8-ssd-nvme-m-2-980-pro-samsung-1tb-pcie-4-0-70005000-mbs-.jpg",
      "especificacoes": [
        "Capacidade: 1TB · M.2 NVMe PCIe 4.0",
        "Leitura: 7000MB/s · Gravação: 5000MB/s",
        "Durabilidade: 600 TBW"
      ],
      "capacidadeGb": 1000,
      "tipoInterface": "NVMe",
      "leituraMbs": 7000,
      "consumoWatts": 7
    },
    {
      "id": "ssd-nvme-2tb",
      "categoria": "armazenamento",
      "nomeCurto": "WD Black SN850X 2TB NVMe",
      "resumoSpecs": "M.2 NVMe PCIe 4.0 · 7300MB/s",
      "nome": "WD Black SN850X 2TB NVMe, 2TB, M.2 NVMe PCIe 4.0, Leitura 7300MB/s, Gravação 6600MB/s",
      "marca": "WD Black",
      "preco": 1099.9,
      "imagem": "img/pecas/reais/storage-9-ssd-nvme-m-2-sn850x-wd-black-2tb-pcie-4-0-73006600-mbs-.jpg",
      "especificacoes": [
        "Capacidade: 2TB · M.2 NVMe PCIe 4.0",
        "Leitura: 7300MB/s · Gravação: 6600MB/s",
        "Durabilidade: 1200 TBW"
      ],
      "capacidadeGb": 2000,
      "tipoInterface": "NVMe",
      "leituraMbs": 7300,
      "consumoWatts": 7
    },
    {
      "id": "storage-10-samsung-990-pro-2tb-nvme",
      "categoria": "armazenamento",
      "nomeCurto": "Samsung 990 PRO 2TB NVMe",
      "resumoSpecs": "M.2 NVMe PCIe 4.0 · 7450MB/s",
      "nome": "Samsung 990 PRO 2TB NVMe, 2TB, M.2 NVMe PCIe 4.0, Leitura 7450MB/s, Gravação 6900MB/s",
      "marca": "Samsung",
      "preco": 1299.9,
      "imagem": "img/pecas/reais/storage-10-ssd-nvme-m-2-990-pro-samsung-2tb-pcie-4-0-74506900-mbs-.jpg",
      "especificacoes": [
        "Capacidade: 2TB · M.2 NVMe PCIe 4.0",
        "Leitura: 7450MB/s · Gravação: 6900MB/s",
        "Durabilidade: 1200 TBW"
      ],
      "capacidadeGb": 2000,
      "tipoInterface": "NVMe",
      "leituraMbs": 7450,
      "consumoWatts": 7
    },
    {
      "id": "storage-11-kingston-fury-renegade-2tb-nvme",
      "categoria": "armazenamento",
      "nomeCurto": "Kingston Fury Renegade 2TB NVMe",
      "resumoSpecs": "M.2 NVMe PCIe 4.0 · 7300MB/s",
      "nome": "Kingston Fury Renegade 2TB NVMe, 2TB, M.2 NVMe PCIe 4.0, Leitura 7300MB/s, Gravação 7000MB/s",
      "marca": "Kingston",
      "preco": 1199.9,
      "imagem": "img/pecas/reais/storage-11-ssd-nvme-m-2-fury-renegade-kingston-2tb-pcie-4-0-730070.jpg",
      "especificacoes": [
        "Capacidade: 2TB · M.2 NVMe PCIe 4.0",
        "Leitura: 7300MB/s · Gravação: 7000MB/s",
        "Durabilidade: 2000 TBW"
      ],
      "capacidadeGb": 2000,
      "tipoInterface": "NVMe",
      "leituraMbs": 7300,
      "consumoWatts": 7
    },
    {
      "id": "storage-12-kingston-nv3-4tb-nvme",
      "categoria": "armazenamento",
      "nomeCurto": "Kingston NV3 4TB NVMe",
      "resumoSpecs": "M.2 NVMe PCIe 4.0 · 6000MB/s",
      "nome": "Kingston NV3 4TB NVMe, 4TB, M.2 NVMe PCIe 4.0, Leitura 6000MB/s, Gravação 4000MB/s",
      "marca": "Kingston",
      "preco": 1699.9,
      "imagem": "img/pecas/reais/storage-12-ssd-nvme-m-3-nv3-kingston-4tb-pcie-4-0-g3-perf-60004000.jpg",
      "especificacoes": [
        "Capacidade: 4TB · M.2 NVMe PCIe 4.0",
        "Leitura: 6000MB/s · Gravação: 4000MB/s",
        "Durabilidade: 321 TBW"
      ],
      "capacidadeGb": 4000,
      "tipoInterface": "NVMe",
      "leituraMbs": 6000,
      "consumoWatts": 7
    },
    {
      "id": "storage-13-crucial-t700-2tb-pcie-5-0",
      "categoria": "armazenamento",
      "nomeCurto": "Crucial T700 2TB PCIe 5.0",
      "resumoSpecs": "M.2 NVMe PCIe 5.0 · 12400MB/s",
      "nome": "Crucial T700 2TB PCIe 5.0, 2TB, M.2 NVMe PCIe 5.0, Leitura 12400MB/s, Gravação 11800MB/s",
      "marca": "Crucial",
      "preco": 1999.9,
      "imagem": "img/pecas/reais/storage-13-ssd-nvme-m-2-t700-crucial-2tb-pcie-5-0-1240011800-mbs-1.jpg",
      "especificacoes": [
        "Capacidade: 2TB · M.2 NVMe PCIe 5.0",
        "Leitura: 12400MB/s · Gravação: 11800MB/s",
        "Durabilidade: 1200 TBW"
      ],
      "capacidadeGb": 2000,
      "tipoInterface": "NVMe",
      "leituraMbs": 12400,
      "consumoWatts": 7
    },
    {
      "id": "storage-14-corsair-mp700-pro-2tb-pcie-5-0",
      "categoria": "armazenamento",
      "nomeCurto": "Corsair MP700 PRO 2TB PCIe 5.0",
      "resumoSpecs": "M.2 NVMe PCIe 5.0 · 12400MB/s",
      "nome": "Corsair MP700 PRO 2TB PCIe 5.0, 2TB, M.2 NVMe PCIe 5.0, Leitura 12400MB/s, Gravação 11800MB/s",
      "marca": "Corsair",
      "preco": 2099.9,
      "imagem": "img/pecas/reais/storage-14-ssd-nvme-m-2-mp700-pro-corsair-2tb-pcie-5-0-1240011800-.jpg",
      "especificacoes": [
        "Capacidade: 2TB · M.2 NVMe PCIe 5.0",
        "Leitura: 12400MB/s · Gravação: 11800MB/s",
        "Durabilidade: 1400 TBW"
      ],
      "capacidadeGb": 2000,
      "tipoInterface": "NVMe",
      "leituraMbs": 12400,
      "consumoWatts": 7
    },
    {
      "id": "storage-15-samsung-990-pro-4tb-nvme",
      "categoria": "armazenamento",
      "nomeCurto": "Samsung 990 PRO 4TB NVMe",
      "resumoSpecs": "M.2 NVMe PCIe 4.0 · 7450MB/s",
      "nome": "Samsung 990 PRO 4TB NVMe, 4TB, M.2 NVMe PCIe 4.0, Leitura 7450MB/s, Gravação 6900MB/s",
      "marca": "Samsung",
      "preco": 2399.9,
      "imagem": "img/pecas/reais/storage-15-ssd-nvme-m-2-990-pro-samsung-4tb-pcie-4-0-74506900-mbs-.jpg",
      "especificacoes": [
        "Capacidade: 4TB · M.2 NVMe PCIe 4.0",
        "Leitura: 7450MB/s · Gravação: 6900MB/s",
        "Durabilidade: 2400 TBW"
      ],
      "capacidadeGb": 4000,
      "tipoInterface": "NVMe",
      "leituraMbs": 7450,
      "consumoWatts": 7
    }
  ],
  "fonte": [
    {
      "id": "psu-cm-450w",
      "categoria": "fonte",
      "nomeCurto": "Cooler Master MWE 450W",
      "resumoSpecs": "450W · 80 Plus Bronze · PFC Ativo",
      "nome": "Fonte Cooler Master MWE 450W, 80 Plus Bronze, PFC Ativo",
      "marca": "Cooler Master",
      "preco": 249.9,
      "imagem": "img/pecas/psu-bronze.webp",
      "especificacoes": [
        "Potência: 450W · 80 Plus Bronze",
        "PFC Ativo · Bivolt Automático",
        "Indicada para PCs de escritório / vídeo integrado"
      ],
      "potenciaWatts": 450
    },
    {
      "id": "psu-1-msi-mag-a550bn-550w",
      "categoria": "fonte",
      "nomeCurto": "MSI MAG A550BN 550W",
      "resumoSpecs": "550W · 80 Plus Bronze · Não Modular",
      "nome": "Fonte MSI MAG A550BN 550W, 550W, 80 Plus Bronze, Não Modular (ATX 2.4)",
      "marca": "MSI",
      "preco": 279.9,
      "imagem": "img/pecas/reais/psu-1-mag-a550bn-msi-550w-bronze-nao-modular-atx-2-4.jpg",
      "especificacoes": [
        "Potência: 550W · Certificação 80 Plus Bronze",
        "Cabeamento: Não Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 550
    },
    {
      "id": "psu-2-xpg-pylon-550w",
      "categoria": "fonte",
      "nomeCurto": "XPG Pylon 550W",
      "resumoSpecs": "550W · 80 Plus Bronze · Não Modular",
      "nome": "Fonte XPG Pylon 550W, 550W, 80 Plus Bronze, Não Modular (ATX 2.4)",
      "marca": "XPG",
      "preco": 299.9,
      "imagem": "img/pecas/reais/psu-2-pylon-550w-xpg-550w-bronze-nao-modular-atx-2-4.jpg",
      "especificacoes": [
        "Potência: 550W · Certificação 80 Plus Bronze",
        "Cabeamento: Não Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 550
    },
    {
      "id": "psu-3-corsair-cx650-650w",
      "categoria": "fonte",
      "nomeCurto": "Corsair CX650 650W",
      "resumoSpecs": "650W · 80 Plus Bronze · Não Modular",
      "nome": "Fonte Corsair CX650 650W, 650W, 80 Plus Bronze, Não Modular (ATX 2.4)",
      "marca": "Corsair",
      "preco": 379.9,
      "imagem": "img/pecas/reais/psu-3-cx650-corsair-650w-bronze-nao-modular-atx-2-4.jpg",
      "especificacoes": [
        "Potência: 650W · Certificação 80 Plus Bronze",
        "Cabeamento: Não Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 650
    },
    {
      "id": "psu-msi-650w",
      "categoria": "fonte",
      "nomeCurto": "MSI MAG A650BN 650W",
      "resumoSpecs": "650W · 80 Plus Bronze · Não Modular",
      "nome": "Fonte MSI MAG A650BN 650W, 650W, 80 Plus Bronze, Não Modular (ATX 2.4)",
      "marca": "MSI",
      "preco": 329.9,
      "imagem": "img/pecas/reais/psu-4-mag-a650bn-msi-650w-bronze-nao-modular-atx-2-4.jpg",
      "especificacoes": [
        "Potência: 650W · Certificação 80 Plus Bronze",
        "Cabeamento: Não Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 650
    },
    {
      "id": "psu-5-cooler-master-mwe-650-bronze-v2",
      "categoria": "fonte",
      "nomeCurto": "Cooler Master MWE 650 Bronze V2",
      "resumoSpecs": "650W · 80 Plus Bronze · Não Modular",
      "nome": "Fonte Cooler Master MWE 650 Bronze V2, 650W, 80 Plus Bronze, Não Modular (ATX 2.52)",
      "marca": "Cooler Master",
      "preco": 359.9,
      "imagem": "img/pecas/reais/psu-5-mwe-650-bronze-v2-cooler-master-650w-bronze-nao-modular.jpg",
      "especificacoes": [
        "Potência: 650W · Certificação 80 Plus Bronze",
        "Cabeamento: Não Modular · Padrão ATX 2.52",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 650
    },
    {
      "id": "psu-6-xpg-core-reactor-650w-gold",
      "categoria": "fonte",
      "nomeCurto": "XPG Core Reactor 650W Gold",
      "resumoSpecs": "650W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte XPG Core Reactor 650W Gold, 650W, 80 Plus Gold, Totalmente Modular (ATX 2.4)",
      "marca": "XPG",
      "preco": 549.9,
      "imagem": "img/pecas/reais/psu-6-core-reactor-650w-xpg-650w-gold-totalmente-modular-atx-.jpg",
      "especificacoes": [
        "Potência: 650W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 650
    },
    {
      "id": "psu-7-corsair-rm750x-750w-gold",
      "categoria": "fonte",
      "nomeCurto": "Corsair RM750x 750W Gold",
      "resumoSpecs": "750W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Corsair RM750x 750W Gold, 750W, 80 Plus Gold, Totalmente Modular (ATX 2.4)",
      "marca": "Corsair",
      "preco": 729.9,
      "imagem": "img/pecas/reais/psu-7-rm750x-corsair-750w-gold-totalmente-modular-atx-2-4.jpg",
      "especificacoes": [
        "Potência: 750W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 750
    },
    {
      "id": "psu-8-xpg-core-reactor-750w-gold",
      "categoria": "fonte",
      "nomeCurto": "XPG Core Reactor 750W Gold",
      "resumoSpecs": "750W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte XPG Core Reactor 750W Gold, 750W, 80 Plus Gold, Totalmente Modular (ATX 2.4)",
      "marca": "XPG",
      "preco": 649.9,
      "imagem": "img/pecas/reais/psu-8-core-reactor-750w-xpg-750w-gold-totalmente-modular-atx-.jpg",
      "especificacoes": [
        "Potência: 750W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 750
    },
    {
      "id": "psu-9-seasonic-focus-gx-750-750w-gold",
      "categoria": "fonte",
      "nomeCurto": "Seasonic Focus GX-750 750W Gold",
      "resumoSpecs": "750W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Seasonic Focus GX-750 750W Gold, 750W, 80 Plus Gold, Totalmente Modular (ATX 2.4)",
      "marca": "Seasonic",
      "preco": 749.9,
      "imagem": "img/pecas/reais/psu-9-focus-gx-750-seasonic-750w-gold-totalmente-modular-atx-.jpg",
      "especificacoes": [
        "Potência: 750W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 750
    },
    {
      "id": "psu-10-super-flower-leadex-iii-750w-gold",
      "categoria": "fonte",
      "nomeCurto": "Super Flower Leadex III 750W Gold",
      "resumoSpecs": "750W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Super Flower Leadex III 750W Gold, 750W, 80 Plus Gold, Totalmente Modular (ATX 2.32)",
      "marca": "Super Flower",
      "preco": 679.9,
      "imagem": "img/pecas/reais/psu-10-leadex-iii-750w-super-flower-750w-gold-totalmente-modul.jpg",
      "especificacoes": [
        "Potência: 750W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 2.32",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 750
    },
    {
      "id": "psu-corsair-750w",
      "categoria": "fonte",
      "nomeCurto": "Corsair RM750e 750W Gold",
      "resumoSpecs": "750W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Corsair RM750e 750W Gold, 750W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "Corsair",
      "preco": 699.9,
      "imagem": "img/pecas/reais/psu-11-rm750e-corsair-750w-gold-totalmente-modular-atx-3-0.jpg",
      "especificacoes": [
        "Potência: 750W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 750
    },
    {
      "id": "psu-12-msi-mpg-a750g-pcie5-750w-gold",
      "categoria": "fonte",
      "nomeCurto": "MSI MPG A750G PCIE5 750W Gold",
      "resumoSpecs": "750W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte MSI MPG A750G PCIE5 750W Gold, 750W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "MSI",
      "preco": 749.9,
      "imagem": "img/pecas/reais/psu-12-mpg-a750g-pcie5-msi-750w-gold-totalmente-modular-atx-3-.jpg",
      "especificacoes": [
        "Potência: 750W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 750
    },
    {
      "id": "psu-13-thermaltake-toughpower-gf3-750w-gold",
      "categoria": "fonte",
      "nomeCurto": "Thermaltake Toughpower GF3 750W Gold",
      "resumoSpecs": "750W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Thermaltake Toughpower GF3 750W Gold, 750W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "Thermaltake",
      "preco": 729.9,
      "imagem": "img/pecas/reais/psu-13-toughpower-gf3-750w-thermaltake-750w-gold-totalmente-mo.jpg",
      "especificacoes": [
        "Potência: 750W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 750
    },
    {
      "id": "psu-14-corsair-rm850x-850w-gold",
      "categoria": "fonte",
      "nomeCurto": "Corsair RM850x 850W Gold",
      "resumoSpecs": "850W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Corsair RM850x 850W Gold, 850W, 80 Plus Gold, Totalmente Modular (ATX 2.4)",
      "marca": "Corsair",
      "preco": 849.9,
      "imagem": "img/pecas/reais/psu-14-rm850x-corsair-850w-gold-totalmente-modular-atx-2-4.jpg",
      "especificacoes": [
        "Potência: 850W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 2.4",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 850
    },
    {
      "id": "psu-15-xpg-core-reactor-ii-850w-gold",
      "categoria": "fonte",
      "nomeCurto": "XPG Core Reactor II 850W Gold",
      "resumoSpecs": "850W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte XPG Core Reactor II 850W Gold, 850W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "XPG",
      "preco": 799.9,
      "imagem": "img/pecas/reais/psu-15-core-reactor-ii-850w-xpg-850w-gold-totalmente-modular-a.jpg",
      "especificacoes": [
        "Potência: 850W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 850
    },
    {
      "id": "psu-16-corsair-rm850e-850w-gold",
      "categoria": "fonte",
      "nomeCurto": "Corsair RM850e 850W Gold",
      "resumoSpecs": "850W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Corsair RM850e 850W Gold, 850W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "Corsair",
      "preco": 799.9,
      "imagem": "img/pecas/reais/psu-16-rm850e-corsair-850w-gold-totalmente-modular-atx-3-0.jpg",
      "especificacoes": [
        "Potência: 850W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 850
    },
    {
      "id": "psu-17-corsair-rm850x-shift-850w-gold",
      "categoria": "fonte",
      "nomeCurto": "Corsair RM850x Shift 850W Gold",
      "resumoSpecs": "850W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Corsair RM850x Shift 850W Gold, 850W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "Corsair",
      "preco": 899.9,
      "imagem": "img/pecas/reais/psu-17-rm850x-shift-corsair-850w-gold-totalmente-modular-atx-3.jpg",
      "especificacoes": [
        "Potência: 850W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 850
    },
    {
      "id": "psu-18-asus-rog-loki-sfx-l-850w-platinum",
      "categoria": "fonte",
      "nomeCurto": "ASUS ROG Loki SFX-L 850W Platinum",
      "resumoSpecs": "850W · 80 Plus Platinum · Totalmente Modular",
      "nome": "Fonte ASUS ROG Loki SFX-L 850W Platinum, 850W, 80 Plus Platinum, Totalmente Modular (SFX-L ATX 3.0)",
      "marca": "ASUS",
      "preco": 1399.9,
      "imagem": "img/pecas/reais/psu-18-rog-loki-sfx-l-850w-asus-850w-platinum-totalmente-modul.jpg",
      "especificacoes": [
        "Potência: 850W · Certificação 80 Plus Platinum",
        "Cabeamento: Totalmente Modular · Padrão SFX-L ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 850
    },
    {
      "id": "psu-19-corsair-sf750-750w-platinum",
      "categoria": "fonte",
      "nomeCurto": "Corsair SF750 750W Platinum",
      "resumoSpecs": "750W · 80 Plus Platinum · Totalmente Modular",
      "nome": "Fonte Corsair SF750 750W Platinum, 750W, 80 Plus Platinum, Totalmente Modular (SFX)",
      "marca": "Corsair",
      "preco": 1199.9,
      "imagem": "img/pecas/reais/psu-19-sf750-corsair-750w-platinum-totalmente-modular.jpg",
      "especificacoes": [
        "Potência: 750W · Certificação 80 Plus Platinum",
        "Cabeamento: Totalmente Modular · Padrão SFX",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 750
    },
    {
      "id": "psu-20-cooler-master-v850-sfx-gold-850w",
      "categoria": "fonte",
      "nomeCurto": "Cooler Master V850 SFX Gold 850W",
      "resumoSpecs": "850W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Cooler Master V850 SFX Gold 850W, 850W, 80 Plus Gold, Totalmente Modular (SFX)",
      "marca": "Cooler Master",
      "preco": 999.9,
      "imagem": "img/pecas/reais/psu-20-v850-sfx-gold-cooler-master-850w-gold-totalmente-modula.jpg",
      "especificacoes": [
        "Potência: 850W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão SFX",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 850
    },
    {
      "id": "psu-21-corsair-rm1000e-1000w-gold",
      "categoria": "fonte",
      "nomeCurto": "Corsair RM1000e 1000W Gold",
      "resumoSpecs": "1000W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Corsair RM1000e 1000W Gold, 1000W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "Corsair",
      "preco": 1099.9,
      "imagem": "img/pecas/reais/psu-21-rm1000e-corsair-1000w-gold-totalmente-modular.jpg",
      "especificacoes": [
        "Potência: 1000W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1000
    },
    {
      "id": "psu-22-corsair-rm1000x-shift-1000w-gold",
      "categoria": "fonte",
      "nomeCurto": "Corsair RM1000x Shift 1000W Gold",
      "resumoSpecs": "1000W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Corsair RM1000x Shift 1000W Gold, 1000W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "Corsair",
      "preco": 1199.9,
      "imagem": "img/pecas/reais/psu-22-rm1000x-shift-corsair-1000w-gold-totalmente-modular.jpg",
      "especificacoes": [
        "Potência: 1000W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1000
    },
    {
      "id": "psu-23-msi-mpg-a1000g-pcie5-1000w-gold",
      "categoria": "fonte",
      "nomeCurto": "MSI MPG A1000G PCIE5 1000W Gold",
      "resumoSpecs": "1000W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte MSI MPG A1000G PCIE5 1000W Gold, 1000W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "MSI",
      "preco": 1149.9,
      "imagem": "img/pecas/reais/psu-23-mpg-a1000g-pcie5-msi-1000w-gold-totalmente-modular.jpg",
      "especificacoes": [
        "Potência: 1000W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1000
    },
    {
      "id": "psu-24-thermaltake-toughpower-gf3-1000w-gold",
      "categoria": "fonte",
      "nomeCurto": "Thermaltake Toughpower GF3 1000W Gold",
      "resumoSpecs": "1000W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Thermaltake Toughpower GF3 1000W Gold, 1000W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "Thermaltake",
      "preco": 1099.9,
      "imagem": "img/pecas/reais/psu-24-toughpower-gf3-1000w-thermaltake-1000w-gold-totalmente-.jpg",
      "especificacoes": [
        "Potência: 1000W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1000
    },
    {
      "id": "psu-25-asus-rog-thor-1000w-platinum-ii",
      "categoria": "fonte",
      "nomeCurto": "ASUS ROG Thor 1000W Platinum II",
      "resumoSpecs": "1000W · 80 Plus Platinum · Totalmente Modular",
      "nome": "Fonte ASUS ROG Thor 1000W Platinum II, 1000W, 80 Plus Platinum, Totalmente Modular (ATX 3.0)",
      "marca": "ASUS",
      "preco": 2199.9,
      "imagem": "img/pecas/reais/psu-25-rog-thor-1000w-plat-ii-asus-1000w-platinum-totalmente-m.jpg",
      "especificacoes": [
        "Potência: 1000W · Certificação 80 Plus Platinum",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1000
    },
    {
      "id": "psu-26-be-quiet-dark-power-13-1000w-titanium",
      "categoria": "fonte",
      "nomeCurto": "be quiet! Dark Power 13 1000W Titanium",
      "resumoSpecs": "1000W · 80 Plus Titanium · Totalmente Modular",
      "nome": "Fonte be quiet! Dark Power 13 1000W Titanium, 1000W, 80 Plus Titanium, Totalmente Modular (ATX 3.0)",
      "marca": "be quiet!",
      "preco": 2299.9,
      "imagem": "img/pecas/reais/psu-26-dark-power-13-1000w-be-quiet-1000w-titanium-totalmente-.jpg",
      "especificacoes": [
        "Potência: 1000W · Certificação 80 Plus Titanium",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1000
    },
    {
      "id": "psu-27-corsair-rm1200x-shift-1200w-gold",
      "categoria": "fonte",
      "nomeCurto": "Corsair RM1200x Shift 1200W Gold",
      "resumoSpecs": "1200W · 80 Plus Gold · Totalmente Modular",
      "nome": "Fonte Corsair RM1200x Shift 1200W Gold, 1200W, 80 Plus Gold, Totalmente Modular (ATX 3.0)",
      "marca": "Corsair",
      "preco": 1499.9,
      "imagem": "img/pecas/reais/psu-27-rm1200x-shift-corsair-1200w-gold-totalmente-modular.jpg",
      "especificacoes": [
        "Potência: 1200W · Certificação 80 Plus Gold",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1200
    },
    {
      "id": "psu-28-seasonic-vertex-px-1200-1200w-platinum",
      "categoria": "fonte",
      "nomeCurto": "Seasonic Vertex PX-1200 1200W Platinum",
      "resumoSpecs": "1200W · 80 Plus Platinum · Totalmente Modular",
      "nome": "Fonte Seasonic Vertex PX-1200 1200W Platinum, 1200W, 80 Plus Platinum, Totalmente Modular (ATX 3.0)",
      "marca": "Seasonic",
      "preco": 1899.9,
      "imagem": "img/pecas/reais/psu-28-vertex-px-1200-seasonic-1200w-platinum-totalmente-modul.jpg",
      "especificacoes": [
        "Potência: 1200W · Certificação 80 Plus Platinum",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1200
    },
    {
      "id": "psu-29-msi-meg-ai1300p-pcie5-1300w-platinum",
      "categoria": "fonte",
      "nomeCurto": "MSI MEG Ai1300P PCIE5 1300W Platinum",
      "resumoSpecs": "1300W · 80 Plus Platinum · Totalmente Modular",
      "nome": "Fonte MSI MEG Ai1300P PCIE5 1300W Platinum, 1300W, 80 Plus Platinum, Totalmente Modular (ATX 3.0)",
      "marca": "MSI",
      "preco": 2199.9,
      "imagem": "img/pecas/reais/psu-29-meg-ai1300p-pcie5-msi-1300w-platinum-totalmente-modular.jpg",
      "especificacoes": [
        "Potência: 1300W · Certificação 80 Plus Platinum",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1300
    },
    {
      "id": "psu-30-asus-rog-thor-1200w-platinum-ii",
      "categoria": "fonte",
      "nomeCurto": "ASUS ROG Thor 1200W Platinum II",
      "resumoSpecs": "1200W · 80 Plus Platinum · Totalmente Modular",
      "nome": "Fonte ASUS ROG Thor 1200W Platinum II, 1200W, 80 Plus Platinum, Totalmente Modular (ATX 3.0)",
      "marca": "ASUS",
      "preco": 2599.9,
      "imagem": "img/pecas/reais/psu-30-rog-thor-1200w-plat-ii-asus-1200w-platinum-totalmente-m.jpg",
      "especificacoes": [
        "Potência: 1200W · Certificação 80 Plus Platinum",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1200
    },
    {
      "id": "psu-31-seasonic-prime-tx-1300-1300w-titanium",
      "categoria": "fonte",
      "nomeCurto": "Seasonic Prime TX-1300 1300W Titanium",
      "resumoSpecs": "1300W · 80 Plus Titanium · Totalmente Modular",
      "nome": "Fonte Seasonic Prime TX-1300 1300W Titanium, 1300W, 80 Plus Titanium, Totalmente Modular (ATX 3.0)",
      "marca": "Seasonic",
      "preco": 2799.9,
      "imagem": "img/pecas/reais/psu-31-prime-tx-1300-seasonic-1300w-titanium-totalmente-modula.jpg",
      "especificacoes": [
        "Potência: 1300W · Certificação 80 Plus Titanium",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1300
    },
    {
      "id": "psu-32-be-quiet-dark-power-pro-13-1600w-titanium",
      "categoria": "fonte",
      "nomeCurto": "be quiet! Dark Power Pro 13 1600W Titanium",
      "resumoSpecs": "1600W · 80 Plus Titanium · Totalmente Modular",
      "nome": "Fonte be quiet! Dark Power Pro 13 1600W Titanium, 1600W, 80 Plus Titanium, Totalmente Modular (ATX 3.0)",
      "marca": "be quiet!",
      "preco": 3499.9,
      "imagem": "img/pecas/reais/psu-32-dark-power-pro-13-1600w-be-quiet-1600w-titanium-totalme.jpg",
      "especificacoes": [
        "Potência: 1600W · Certificação 80 Plus Titanium",
        "Cabeamento: Totalmente Modular · Padrão ATX 3.0",
        "PFC Ativo e proteções elétricas completas"
      ],
      "potenciaWatts": 1600
    },
    {
      "id": "psu-xpg-850w",
      "categoria": "fonte",
      "nomeCurto": "XPG Core Reactor 850W Gold",
      "resumoSpecs": "850W · 80 Plus Gold · Modular",
      "nome": "Fonte XPG Core Reactor, 850W, 80 Plus Gold, Full Modular",
      "marca": "XPG",
      "preco": 799.9,
      "imagem": "img/pecas/psu-modular.webp",
      "especificacoes": [
        "Potência: 850W · 80 Plus Gold",
        "100% Modular · Capacitores Japoneses",
        "Folga máxima para upgrades"
      ],
      "potenciaWatts": 850
    }
  ],
  "gabinete": [
    {
      "id": "case-hx300m",
      "categoria": "gabinete",
      "nomeCurto": "Pichau HX300M Glass",
      "resumoSpecs": "Mini Tower · Micro-ATX · GPU 290mm",
      "nome": "Gabinete Pichau HX300M Glass, Mini Tower, Micro-ATX, Lateral em Vidro",
      "marca": "Pichau",
      "preco": 199.9,
      "imagem": "img/pecas/case-matx.webp",
      "especificacoes": [
        "Suporta placas: Micro-ATX e Mini-ITX (Não aceita ATX)",
        "GPU máx.: 290mm · Cooler máx.: 160mm",
        "Compacto com lateral em vidro"
      ],
      "formatosPlacaMae": [
        "Micro-ATX",
        "Mini-ITX"
      ],
      "maxComprimentoGpuMm": 290,
      "maxAlturaCoolerMm": 160,
      "consumoWatts": 5
    },
    {
      "id": "case-montech-x3",
      "categoria": "gabinete",
      "nomeCurto": "Montech X3 Mesh",
      "resumoSpecs": "Mid Tower · ATX · 6 fans",
      "nome": "Gabinete Gamer Montech X3 Mesh, Mid Tower, ATX, Frente Mesh com 6 Fans",
      "marca": "Montech",
      "preco": 319.9,
      "imagem": "img/pecas/case-mesh.webp",
      "especificacoes": [
        "Suporta placas: ATX, Micro-ATX e Mini-ITX",
        "GPU máx.: 305mm · Cooler máx.: 160mm",
        "Frente Mesh com 6 ventoinhas inclusas"
      ],
      "formatosPlacaMae": [
        "ATX",
        "Micro-ATX",
        "Mini-ITX"
      ],
      "maxComprimentoGpuMm": 305,
      "maxAlturaCoolerMm": 160,
      "consumoWatts": 15
    },
    {
      "id": "case-corsair-4000d",
      "categoria": "gabinete",
      "nomeCurto": "Corsair 4000D Airflow",
      "resumoSpecs": "Mid Tower · ATX · GPU 360mm",
      "nome": "Gabinete Corsair 4000D Airflow, Mid Tower, ATX, Lateral em Vidro Temperado",
      "marca": "Corsair",
      "preco": 549.9,
      "imagem": "img/pecas/case-tower.webp",
      "especificacoes": [
        "Suporta placas: ATX, Micro-ATX e Mini-ITX",
        "GPU máx.: 360mm · Cooler máx.: 170mm",
        "Alto fluxo de ar para GPUs Triple Fan"
      ],
      "formatosPlacaMae": [
        "ATX",
        "Micro-ATX",
        "Mini-ITX"
      ],
      "maxComprimentoGpuMm": 360,
      "maxAlturaCoolerMm": 170,
      "consumoWatts": 10
    }
  ],
  "cooler": [
    {
      "id": "cooler-box-padrao",
      "categoria": "cooler",
      "nomeCurto": "Cooler Box Padrão",
      "resumoSpecs": "92mm · até 65W TDP",
      "nome": "Cooler Box Padrão AMD/Intel (Para Processadores até 65W TDP)",
      "marca": "OEM",
      "preco": 49.9,
      "imagem": "img/pecas/cooler-box.webp",
      "especificacoes": [
        "Soquetes: AM4, AM5, LGA 1200 e LGA 1700",
        "Capacidade térmica máx.: 65W TDP",
        "Incompatível com CPUs de 105W/120W+"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700"
      ],
      "tdpMaximoWatts": 65,
      "alturaMm": 65,
      "consumoWatts": 4
    },
    {
      "id": "cooler-deepcool-ak400",
      "categoria": "cooler",
      "nomeCurto": "DeepCool AK400",
      "resumoSpecs": "Air Cooler · 120mm · 4 Heatpipes · até 220W",
      "nome": "Air Cooler DeepCool AK400, Universal (Intel/AMD), 120mm · 4 Heatpipes, até 220W TDP",
      "marca": "DeepCool",
      "preco": 169.9,
      "imagem": "img/pecas/reais/cooler-2-air-cooler-ak400-deepcool-universal-intelamd-220w.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 220W TDP",
        "Air Cooler (120mm · 4 Heatpipes) · Altura: 155mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 220,
      "alturaMm": 155,
      "consumoWatts": 6
    },
    {
      "id": "cooler-ml240l",
      "categoria": "cooler",
      "nomeCurto": "MasterLiquid ML240L V2",
      "resumoSpecs": "Water Cooler 240mm · 250W TDP",
      "nome": "Water Cooler Cooler Master MasterLiquid ML240L V2, 240mm",
      "marca": "Cooler Master",
      "preco": 419.9,
      "imagem": "img/pecas/cooler-aio.webp",
      "especificacoes": [
        "Soquetes: Universal (AM4, AM5, LGA 1200, 1700, 1851, 2011-3)",
        "Capacidade térmica: até 250W TDP",
        "Radiador de 240mm com 2 fans 120mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 250,
      "alturaMm": 55,
      "consumoWatts": 15
    },
    {
      "id": "cooler-1-cooler-master-hyper-212-black-edition",
      "categoria": "cooler",
      "nomeCurto": "Cooler Master Hyper 212 Black Edition",
      "resumoSpecs": "Air Cooler · 120mm · 4 Heatpipes · até 150W",
      "nome": "Air Cooler Cooler Master Hyper 212 Black Edition, Universal (Intel/AMD), 120mm · 4 Heatpipes, até 150W TDP",
      "marca": "Cooler Master",
      "preco": 189.9,
      "imagem": "img/pecas/reais/cooler-1-air-cooler-hyper-212-black-edition-cooler-master-univer.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 150W TDP",
        "Air Cooler (120mm · 4 Heatpipes) · Altura: 158mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 150,
      "alturaMm": 158,
      "consumoWatts": 6
    },
    {
      "id": "cooler-3-thermalright-peerless-assassin-120-se",
      "categoria": "cooler",
      "nomeCurto": "Thermalright Peerless Assassin 120 SE",
      "resumoSpecs": "Air Cooler · Dual Tower 120mm · 6 Heatpipes · até 245W",
      "nome": "Air Cooler Thermalright Peerless Assassin 120 SE, Universal (Intel/AMD), Dual Tower 120mm · 6 Heatpipes, até 245W TDP",
      "marca": "Thermalright",
      "preco": 279.9,
      "imagem": "img/pecas/reais/cooler-3-air-cooler-peerless-assassin-120-se-thermalright-univer.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 245W TDP",
        "Air Cooler (Dual Tower 120mm · 6 Heatpipes) · Altura: 155mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 245,
      "alturaMm": 155,
      "consumoWatts": 6
    },
    {
      "id": "cooler-4-scythe-fuma-3",
      "categoria": "cooler",
      "nomeCurto": "Scythe Fuma 3",
      "resumoSpecs": "Air Cooler · Dual Tower 120mm · 6 Heatpipes · até 250W",
      "nome": "Air Cooler Scythe Fuma 3, Universal (Intel/AMD), Dual Tower 120mm · 6 Heatpipes, até 250W TDP",
      "marca": "Scythe",
      "preco": 349.9,
      "imagem": "img/pecas/reais/cooler-4-air-cooler-fuma-3-scythe-universal-intelamd-250w.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 250W TDP",
        "Air Cooler (Dual Tower 120mm · 6 Heatpipes) · Altura: 154mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 250,
      "alturaMm": 154,
      "consumoWatts": 6
    },
    {
      "id": "cooler-5-rise-mode-storm-8-black",
      "categoria": "cooler",
      "nomeCurto": "Rise Mode Storm 8 Black",
      "resumoSpecs": "Air Cooler · Dual Tower 120mm · 8 Heatpipes · até 280W",
      "nome": "Air Cooler Rise Mode Storm 8 Black, Universal (Intel/AMD), Dual Tower 120mm · 8 Heatpipes, até 280W TDP",
      "marca": "Rise Mode",
      "preco": 229.9,
      "imagem": "img/pecas/reais/cooler-5-air-cooler-storm-8-black-rise-mode-universal-intelamd-2.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 280W TDP",
        "Air Cooler (Dual Tower 120mm · 8 Heatpipes) · Altura: 158mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 280,
      "alturaMm": 158,
      "consumoWatts": 6
    },
    {
      "id": "cooler-6-cooler-master-masterliquid-ml120l-v2",
      "categoria": "cooler",
      "nomeCurto": "Cooler Master MasterLiquid ML120L V2",
      "resumoSpecs": "Water Cooler · Radiador 120mm · até 180W",
      "nome": "Water Cooler Cooler Master MasterLiquid ML120L V2, Universal (Intel/AMD), Radiador 120mm, até 180W TDP",
      "marca": "Cooler Master",
      "preco": 299.9,
      "imagem": "img/pecas/reais/cooler-6-water-cooler-masterliquid-ml120l-v2-cooler-master-unive.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 180W TDP",
        "Water Cooler (Radiador 120mm) · Altura: 55mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 180,
      "alturaMm": 55,
      "consumoWatts": 15
    },
    {
      "id": "cooler-7-nzxt-kraken-240",
      "categoria": "cooler",
      "nomeCurto": "NZXT Kraken 240",
      "resumoSpecs": "Water Cooler · Radiador 240mm · Display LCD · até 280W",
      "nome": "Water Cooler NZXT Kraken 240, Universal (Intel/AMD), Radiador 240mm · Display LCD, até 280W TDP",
      "marca": "NZXT",
      "preco": 899.9,
      "imagem": "img/pecas/reais/cooler-7-water-cooler-kraken-240-nzxt-universal-intelamd-280w-24.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 280W TDP",
        "Water Cooler (Radiador 240mm · Display LCD) · Altura: 55mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 280,
      "alturaMm": 55,
      "consumoWatts": 15
    },
    {
      "id": "cooler-8-arctic-liquid-freezer-iii-280",
      "categoria": "cooler",
      "nomeCurto": "Arctic Liquid Freezer III 280",
      "resumoSpecs": "Water Cooler · Radiador 280mm · até 300W",
      "nome": "Water Cooler Arctic Liquid Freezer III 280, Universal (Intel/AMD), Radiador 280mm, até 300W TDP",
      "marca": "Arctic",
      "preco": 699.9,
      "imagem": "img/pecas/reais/cooler-8-water-cooler-liquid-freezer-iii-280-arctic-universal-in.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 300W TDP",
        "Water Cooler (Radiador 280mm) · Altura: 60mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 300,
      "alturaMm": 60,
      "consumoWatts": 15
    },
    {
      "id": "cooler-9-deepcool-ls720-360mm",
      "categoria": "cooler",
      "nomeCurto": "DeepCool LS720 360mm",
      "resumoSpecs": "Water Cooler · Radiador 360mm ARGB · até 300W",
      "nome": "Water Cooler DeepCool LS720 360mm, Universal (Intel/AMD), Radiador 360mm ARGB, até 300W TDP",
      "marca": "DeepCool",
      "preco": 749.9,
      "imagem": "img/pecas/reais/cooler-9-water-cooler-ls720-deepcool-universal-intelamd-300w-360.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 300W TDP",
        "Water Cooler (Radiador 360mm ARGB) · Altura: 55mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 300,
      "alturaMm": 55,
      "consumoWatts": 15
    },
    {
      "id": "cooler-10-lian-li-galahad-ii-trinity-360",
      "categoria": "cooler",
      "nomeCurto": "Lian Li Galahad II Trinity 360",
      "resumoSpecs": "Water Cooler · Radiador 360mm ARGB · até 350W",
      "nome": "Water Cooler Lian Li Galahad II Trinity 360, Universal (Intel/AMD), Radiador 360mm ARGB, até 350W TDP",
      "marca": "Lian Li",
      "preco": 999.9,
      "imagem": "img/pecas/reais/cooler-10-water-cooler-galahad-ii-trinity-360-lian-li-universal-i.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 350W TDP",
        "Water Cooler (Radiador 360mm ARGB) · Altura: 60mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 350,
      "alturaMm": 60,
      "consumoWatts": 15
    },
    {
      "id": "cooler-11-corsair-nautilus-rs-360",
      "categoria": "cooler",
      "nomeCurto": "Corsair Nautilus RS 360",
      "resumoSpecs": "Water Cooler · Radiador 360mm · até 350W",
      "nome": "Water Cooler Corsair Nautilus RS 360, Universal (Intel/AMD), Radiador 360mm, até 350W TDP",
      "marca": "Corsair",
      "preco": 849.9,
      "imagem": "img/pecas/reais/cooler-11-wate-cooler-nautilus-rs-corsair-universal-intelamd-350w.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 350W TDP",
        "Water Cooler (Radiador 360mm) · Altura: 60mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 350,
      "alturaMm": 60,
      "consumoWatts": 15
    },
    {
      "id": "cooler-12-nzxt-kraken-elite-360",
      "categoria": "cooler",
      "nomeCurto": "NZXT Kraken Elite 360",
      "resumoSpecs": "Water Cooler · Radiador 360mm · LCD IPS · até 350W",
      "nome": "Water Cooler NZXT Kraken Elite 360, Universal (Intel/AMD), Radiador 360mm · LCD IPS, até 350W TDP",
      "marca": "NZXT",
      "preco": 1599.9,
      "imagem": "img/pecas/reais/cooler-12-water-cooler-kraken-elite-360-nzxt-universal-intelamd-3.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 350W TDP",
        "Water Cooler (Radiador 360mm · LCD IPS) · Altura: 60mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 350,
      "alturaMm": 60,
      "consumoWatts": 15
    },
    {
      "id": "cooler-13-arctic-liquid-freezer-iii-420",
      "categoria": "cooler",
      "nomeCurto": "Arctic Liquid Freezer III 420",
      "resumoSpecs": "Water Cooler · Radiador 420mm Extreme · até 400W",
      "nome": "Water Cooler Arctic Liquid Freezer III 420, Universal (Intel/AMD), Radiador 420mm Extreme, até 400W TDP",
      "marca": "Arctic",
      "preco": 899.9,
      "imagem": "img/pecas/reais/cooler-13-water-cooler-liquid-freezer-iii-420-arctic-universal-in.jpg",
      "especificacoes": [
        "Compatibilidade Universal: AM4, AM5, LGA 1200, 1700, 1851 e 2011-3",
        "Capacidade térmica máx.: até 400W TDP",
        "Water Cooler (Radiador 420mm Extreme) · Altura: 60mm"
      ],
      "soquetesSuportados": [
        "AM4",
        "AM5",
        "LGA1200",
        "LGA1700",
        "LGA1851",
        "LGA2011-3"
      ],
      "tdpMaximoWatts": 400,
      "alturaMm": 60,
      "consumoWatts": 15
    }
  ]
};

export function buscarPecaPorId(idPeca: string | null | undefined): Peca | null {
  if (!idPeca) return null;
  for (const lista of Object.values(CATALOGO_PECAS)) {
    const encontrada = lista.find((item) => item.id === idPeca);
    if (encontrada) return encontrada;
  }
  return null;
}
