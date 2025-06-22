import { render, screen, fireEvent} from '@testing-library/react';
import RegistrarVoto from '../RegistrarVoto';
import useVotar from '../../hooks/useVotar';
import { OpcaoVoto, VotoResponse } from '../../types/Voto';

jest.mock('../../hooks/useVotar');

jest.mock('../form/VotacaoForm', () => {
  return {
    __esModule: true,
    default: ({ 
      associadoId, 
      pautaId, 
      votando, 
      erro, 
      onVotar 
    }: { 
      associadoId: number, 
      pautaId: number, 
      votando: boolean, 
      erro: string | null, 
      onVotar: (opcao: OpcaoVoto) => void 
    }) => (
      <div data-testid="votacao-form-mock">
        <p>Associado ID: {associadoId}</p>
        <p>Pauta ID: {pautaId}</p>
        <p data-testid="estado-votando">{votando ? 'Votando' : 'Não Votando'}</p>
        {erro && <p data-testid="erro-votacao">{erro}</p>}
        <button onClick={() => onVotar(OpcaoVoto.SIM)}>Votar SIM</button>
        <button onClick={() => onVotar(OpcaoVoto.NAO)}>Votar NÃO</button>
      </div>
    )
  };
});

describe('RegistrarVoto', () => {
  const mockPautaId = 10;
  const mockVotoResponse: VotoResponse = {
    id: 1,
    opcao: OpcaoVoto.SIM,
    dataHora: '2025-06-22T10:30:00',
    associadoId: 5,
    associadoNome: 'João Silva',
    pautaId: mockPautaId,
    pautaTitulo: 'Pauta Importante'
  };
  
  const mockVotarFn = jest.fn().mockResolvedValue(mockVotoResponse);

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useVotar as jest.Mock).mockReturnValue({
      votar: mockVotarFn,
      votando: false,
      erro: null,
      resultado: null
    });
  });

  it('deve renderizar o formulário inicial para inserir ID do associado', () => {
    render(<RegistrarVoto pautaId={mockPautaId} />);

    expect(screen.getByText('Votação')).toBeInTheDocument();
    expect(screen.getByLabelText('ID do Associado:')).toBeInTheDocument();
    expect(screen.getByText('Prosseguir')).toBeInTheDocument();
  });

  it('deve mostrar erro quando tenta prosseguir sem ID do associado', () => {
    render(<RegistrarVoto pautaId={mockPautaId} />);
 
    fireEvent.click(screen.getByText('Prosseguir'));
 
    expect(screen.getByText('Informe o ID do associado para votar')).toBeInTheDocument();
  });

  it('deve mostrar VotacaoForm quando o ID do associado é inserido', () => {
    render(<RegistrarVoto pautaId={mockPautaId} />);
  
    fireEvent.change(screen.getByLabelText('ID do Associado:'), { target: { value: '5' } });
 
    fireEvent.click(screen.getByText('Prosseguir'));
  
    expect(screen.getByTestId('votacao-form-mock')).toBeInTheDocument();
    expect(screen.getByText('Associado ID: 5')).toBeInTheDocument();
    expect(screen.getByText(`Pauta ID: ${mockPautaId}`)).toBeInTheDocument();
  });

  it('deve chamar votar com os parâmetros corretos quando voto é registrado', async () => {
    render(<RegistrarVoto pautaId={mockPautaId} />);

    fireEvent.change(screen.getByLabelText('ID do Associado:'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Prosseguir'));
    
    fireEvent.click(screen.getByText('Votar SIM'));
    
    expect(mockVotarFn).toHaveBeenCalledWith(5, mockPautaId, OpcaoVoto.SIM);
  });

  it('deve mostrar o estado de votando quando está processando o voto', () => {

    (useVotar as jest.Mock).mockReturnValue({
      votar: mockVotarFn,
      votando: true,
      erro: null,
      resultado: null
    });
    
    render(<RegistrarVoto pautaId={mockPautaId} />);
    
    fireEvent.change(screen.getByLabelText('ID do Associado:'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Prosseguir'));
    
    expect(screen.getByTestId('estado-votando').textContent).toBe('Votando');
  });

  it('deve mostrar erro quando falha ao registrar voto', () => {

    (useVotar as jest.Mock).mockReturnValue({
      votar: mockVotarFn,
      votando: false,
      erro: 'Erro ao registrar voto',
      resultado: null
    });
    
    render(<RegistrarVoto pautaId={mockPautaId} />);
    
    fireEvent.change(screen.getByLabelText('ID do Associado:'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Prosseguir'));
    
    expect(screen.getByTestId('erro-votacao').textContent).toBe('Erro ao registrar voto');
  });
});