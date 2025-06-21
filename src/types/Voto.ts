export enum OpcaoVoto {
  SIM = 'SIM',
  NAO = 'NAO'
}

export interface VotoRequest {
  associadoId: number;
  pautaId: number;
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