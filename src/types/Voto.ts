export enum OpcaoVoto {
  SIM = 'SIM',
  NAO = 'NAO'
}

export interface VotoRequest {
  associadoId: number;
  pautaId: number;
  opcao: OpcaoVoto;
}

export interface VotoAtualizarRequest {
  opcao: OpcaoVoto;
}

export interface VotoResponse {
  id: number;
  opcao: OpcaoVoto;
  dataHora: string;
  associadoId: number;
  associadoNome: string;
  pautaId: number;
  pautaTitulo: string;
}

export interface ResultadoVotacaoResponse {
  pautaId: number;
  pautaTitulo: string;
  votosSim: number;
  votosNao: number;
  totalVotos: number;
}