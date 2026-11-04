/** Tipos do catálogo, do montador e dos relatórios (dados vindos do Konoha Hardware). */

export type Categoria = 'cpu' | 'placamae' | 'ram' | 'gpu' | 'armazenamento' | 'fonte' | 'gabinete' | 'cooler';

export const ORDEM_CATEGORIAS: Categoria[] = ['cpu', 'placamae', 'ram', 'gpu', 'armazenamento', 'fonte', 'gabinete', 'cooler'];

export type CategoriaInfo = {
  id: Categoria;
  ordem: number;
  nome: string;
  tituloCurto: string;
  descricao: string;
  iconeSvg: string;
  obrigatorio: boolean;
};

/** Peça do catálogo. Os campos técnicos variam por categoria (soquete, tipoRam, comprimentoMm...). */
export type Peca = {
  id: string;
  categoria: Categoria;
  nomeCurto: string;
  resumoSpecs: string;
  nome: string;
  marca: string;
  preco: number;
  imagem: string;
  especificacoes: string[];
  soquete?: string;
  tipoRam?: string;
  tipoRamSuportada?: string;
  tdpWatts?: number;
  possuiVideoIntegrado?: boolean;
  requerVideoIntegradoCpu?: boolean;
  formato?: string;
  formatosPlacaMae?: string[];
  comprimentoMm?: number;
  maxComprimentoGpuMm?: number;
  alturaMm?: number;
  maxAlturaCoolerMm?: number;
  soquetesSuportados?: string[];
  tdpMaximoWatts?: number;
  potenciaWatts?: number;
  consumoWatts?: number;
  fonteRecomendadaWatts?: number;
  [campo: string]: unknown;
};

export type Selecao = Record<Categoria, Peca | null>;

export type Finalidade = 'jogos' | 'trabalho' | 'hibrido';

export type PcPronto = {
  id: string;
  nivel: string;
  etiquetaTopo: string;
  tituloCard: string;
  nome?: string;
  subtitulo?: string;
  chamadaCurta: string;
  perfilUso?: string;
  finalidade?: string;
  imagem: string;
  componentesPrincipais: string[];
  especificacoesLista?: string[];
  memoriaResumo?: string;
  armazenamentoResumo?: string;
  limitacoes?: string[];
  limitacaoCurta?: string;
  pecasIds: Record<Categoria, string>;
  [campo: string]: unknown;
};

export type TemaQuiz = {
  id: string;
  titulo: string;
  etiqueta: string;
  descricao: string;
  perguntas: { enunciado: string; alternativas: string[]; correta: number; explicacao: string }[];
};

type ResultadoFps = { media: number | null; qualidade: string; disponivel: boolean; motivo?: string };

export type RelatorioDesempenho = {
  finalidade: Finalidade;
  precoTotal: number;
  pecasSelecionadas: Peca[];
  classificacaoGeral: string;
  descricaoDesempenho: string;
  estimativasFps: { nome: string; genero: string; fps1080p: ResultadoFps; fps1440p: ResultadoFps }[];
  avaliacaoAplicacoesTrabalho: { area: string; nivelAdequacao: string; statusClasse: string; detalhe: string }[];
  recomendacoesUso: string[];
  pontosFortes: string[];
  limitacoes: string[];
};
