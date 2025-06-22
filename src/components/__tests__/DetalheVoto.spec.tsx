import { render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import DetalheVoto from '../DetalheVoto';
import useVotoDetalhes from '../../hooks/useVotoDetalhes';
import { OpcaoVoto, VotoResponse } from '../../types/Voto';

jest.mock('../../hooks/useVotoDetalhes');
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

describe('DetalheVoto', () => {
  const mockVoto: VotoResponse = {
    id: 1,
    opcao: OpcaoVoto.SIM,
    dataHora: '2025-06-22T10:30:00',
    associadoId: 5,
    associadoNome: 'João Silva',
    pautaId: 10,
    pautaTitulo: 'Pauta Importante'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    
    (useVotoDetalhes as jest.Mock).mockReturnValue({
      voto: mockVoto,
      carregando: false,
      erro: null,
      carregarVoto: jest.fn()
    });
  });

  it('deve exibir mensagem de carregamento quando está buscando dados', () => {
    (useVotoDetalhes as jest.Mock).mockReturnValue({
      voto: null,
      carregando: true,
      erro: null,
      carregarVoto: jest.fn()
    });
    
    render(<DetalheVoto />);
    
    expect(screen.getByText('Carregando detalhes do voto...')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando falha ao carregar dados', () => {
    (useVotoDetalhes as jest.Mock).mockReturnValue({
      voto: null,
      carregando: false,
      erro: 'Erro ao carregar voto',
      carregarVoto: jest.fn()
    });
    
    render(<DetalheVoto />);
    
    expect(screen.getByText('Erro ao carregar voto')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando o voto não é encontrado', () => {
    (useVotoDetalhes as jest.Mock).mockReturnValue({
      voto: null,
      carregando: false,
      erro: null,
      carregarVoto: jest.fn()
    });
    
    render(<DetalheVoto />);
    
    expect(screen.getByText('Voto não encontrado')).toBeInTheDocument();
  });

  it('deve usar o ID da URL para carregar o voto correto', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '42' });

    (useVotoDetalhes as jest.Mock).mockClear();
    
    render(<DetalheVoto />);

    expect(useVotoDetalhes).toHaveBeenCalledWith(
      expect.objectContaining({ id: 42 })
    );
  });
});