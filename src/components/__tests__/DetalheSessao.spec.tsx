import { render, screen, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import DetalheSessao from '../DetalheSessao';
import useSessaoVotacaoDetalhes from '../../hooks/useSessaoVotacaoDetalhes';
import { SessaoVotacaoResponse } from '../../types/SessaoVotacao';

jest.mock('../../hooks/useSessaoVotacaoDetalhes');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

jest.mock('../Banner', () => {
  return {
    __esModule: true,
    default: ({ titulo, descricao }: { titulo: string, descricao: string }) => (
      <div data-testid="banner-mock">
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    )
  };
});

jest.mock('../AtualizarPeriodoSessao', () => {
  return {
    __esModule: true,
    default: ({ 
      sessaoId, 
      onSuccess 
    }: { 
      sessaoId: number, 
      onSuccess: () => void 
    }) => (
      <div data-testid="atualizar-periodo-sessao-mock">
        <p>Sessão ID: {sessaoId}</p>
        <button onClick={onSuccess}>Simular Atualização</button>
      </div>
    )
  };
});

describe('DetalheSessao', () => {
  const mockSessao: SessaoVotacaoResponse = {
    id: 1,
    pautaId: 2,
    pautaTitulo: 'Pauta de Teste',
    dataAbertura: '2025-06-22T10:00:00',
    dataFechamento: '2025-06-22T11:00:00',
    status: 'ABERTA',
    abertaParaVotacao: true
  };
  
  const mockCarregarSessao = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    
    (useSessaoVotacaoDetalhes as jest.Mock).mockReturnValue({
      sessao: mockSessao,
      carregando: false,
      erro: null,
      carregarSessao: mockCarregarSessao
    });
  });

  it('deve exibir mensagem de carregamento quando está buscando dados', () => {
    (useSessaoVotacaoDetalhes as jest.Mock).mockReturnValue({
      sessao: null,
      carregando: true,
      erro: null,
      carregarSessao: mockCarregarSessao
    });
    
    render(<DetalheSessao />);
    
    expect(screen.getByText('Carregando dados da sessão...')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando falha ao carregar dados', () => {
    (useSessaoVotacaoDetalhes as jest.Mock).mockReturnValue({
      sessao: null,
      carregando: false,
      erro: 'Erro ao carregar sessão',
      carregarSessao: mockCarregarSessao
    });
    
    render(<DetalheSessao />);
    
    expect(screen.getByText('Erro ao carregar sessão')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando a sessão não é encontrada', () => {
    (useSessaoVotacaoDetalhes as jest.Mock).mockReturnValue({
      sessao: null,
      carregando: false,
      erro: null,
      carregarSessao: mockCarregarSessao
    });
    
    render(<DetalheSessao />);
    
    expect(screen.getByText('Sessão não encontrada')).toBeInTheDocument();
  });

  it('não deve mostrar botão de estender para sessões encerradas', () => {
    (useSessaoVotacaoDetalhes as jest.Mock).mockReturnValue({
      sessao: {
        ...mockSessao,
        status: 'ENCERRADA'
      },
      carregando: false,
      erro: null,
      carregarSessao: mockCarregarSessao
    });
    
    render(<DetalheSessao />);
    
    expect(screen.queryByText('Estender Período da Votação')).not.toBeInTheDocument();
  });

  it('deve mostrar formulário de atualização quando o botão é clicado', () => {
    render(<DetalheSessao />);
    
    const botao = screen.getByText('Estender Período da Votação');
    expect(botao).toBeInTheDocument();
    
    fireEvent.click(botao);
    
    expect(screen.getByTestId('atualizar-periodo-sessao-mock')).toBeInTheDocument();
    
    expect(screen.queryByText('Estender Período da Votação')).not.toBeInTheDocument();
  });

  it('deve recarregar dados quando a atualização é bem-sucedida', () => {
    render(<DetalheSessao />);
    
    fireEvent.click(screen.getByText('Estender Período da Votação'));
    
    fireEvent.click(screen.getByText('Simular Atualização'));
    
    expect(mockCarregarSessao).toHaveBeenCalledWith(1);
  });

  it('deve usar o ID da URL para carregar a sessão correta', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '42' });
    
    (useSessaoVotacaoDetalhes as jest.Mock).mockClear();
    
    render(<DetalheSessao />);
    
    expect(useSessaoVotacaoDetalhes).toHaveBeenCalledWith(
      expect.objectContaining({ id: 42 })
    );
  });
});