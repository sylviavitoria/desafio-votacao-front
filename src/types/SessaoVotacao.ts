export interface SessaoVotacaoRequest {
  pautaId: number;
  duracaoMinutos?: number;
  dataInicio?: string;
  dataFim?: string;
}

export type StatusSessao = 'ABERTA' | 'FECHADA' | 'FINALIZADA';

export interface SessaoVotacaoResponse {
  id: number;
  pautaId: number;
  pautaTitulo: string;
  dataAbertura: string;
  dataFechamento: string;
  status: StatusSessao;
  abertaParaVotacao: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface SessaoVotacaoAtualizarRequest {
  dataFim?: string;
  minutosAdicionais?: number;
}