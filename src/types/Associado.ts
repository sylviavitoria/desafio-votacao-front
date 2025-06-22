export interface Associado {
  nome: string;
  cpf: string;
  email: string;
  id?: number;
}

export interface AssociadoResponse {
  id: number;
  nome: string;
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