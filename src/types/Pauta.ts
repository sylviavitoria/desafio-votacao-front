export interface Pauta {
  titulo: string;
  descricao: string;
  criadorId: number;
  id?: number;
  dataCriacao?: string;
  status?: StatusPauta;
  totalVotosSim?: number;
  totalVotosNao?: number;
  criador?: {
    id: number;
    nome: string;
  };
}

export interface PautaAtualizarRequest {
  titulo: string;
  descricao: string;
}

export type StatusPauta = 'CRIADA' | 'EM_VOTACAO' | 'ENCERRADA' | 'APROVADA' | 'RECUSADA' | 'EMPATADA';

export interface PautaResponse {
  id: number;
  titulo: string;
  descricao: string;
  dataCriacao: string;
  status: StatusPauta;
  totalVotosSim: number;
  totalVotosNao: number;
  criador: {
    id: number;
    nome: string;
  };
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