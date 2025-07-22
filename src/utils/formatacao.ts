export function formatarData(dataString: string): string {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusPauta(status: string) {
  const statusMap: Record<string, { texto: string; classe: string }> = {
    CRIADA: { texto: 'Criada', classe: 'status-info' },
    EM_VOTACAO: { texto: 'Em Votação', classe: 'status-warning' },
    ENCERRADA: { texto: 'Encerrada', classe: 'status-dark' },
    APROVADA: { texto: 'Aprovada', classe: 'status-success' },
    RECUSADA: { texto: 'Recusada', classe: 'status-danger' },
    EMPATADA: { texto: 'Empatada', classe: 'status-secondary' }
  };
  return statusMap[status] || { texto: status, classe: '' };
}

export function getStatusSessao(status: string) {
  const statusMap: Record<string, { texto: string; classe: string }> = {
    ABERTA: { texto: 'Aberta', classe: 'status-warning' },
    FECHADA: { texto: 'Fechada', classe: 'status-info' },
    FINALIZADA: { texto: 'Finalizada', classe: 'status-dark' }
  };
  return statusMap[status] || { texto: status, classe: '' };
}
