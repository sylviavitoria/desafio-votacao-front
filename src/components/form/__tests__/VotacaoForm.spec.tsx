import { render, screen, fireEvent } from '@testing-library/react';
import VotacaoForm from '../VotacaoForm';
import { OpcaoVoto } from '../../../types/Voto';

describe('VotacaoForm', () => {
  const mockOnVotar = jest.fn();
  
  beforeEach(() => {
    mockOnVotar.mockClear();
  });

  it('deve renderizar corretamente com os dados do associado e da pauta', () => {
    render(
      <VotacaoForm 
        associadoId={123}
        pautaId={456}
        votando={false}
        erro={null}
        onVotar={mockOnVotar}
      />
    );

    expect(screen.getByText('Registrar seu voto')).toBeInTheDocument();

    expect(screen.getByText('ID do Associado:')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    
    expect(screen.getByText('ID da Pauta:')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
  
    expect(screen.getByText('SIM')).toBeInTheDocument();
    expect(screen.getByText('NÃO')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando houver erro', () => {
    const erro = 'Erro na votação';
    render(
      <VotacaoForm 
        associadoId={123}
        pautaId={456}
        votando={false}
        erro={erro}
        onVotar={mockOnVotar}
      />
    );
    
    expect(screen.getByText(erro)).toBeInTheDocument();
  });

  it('deve chamar onVotar com opção SIM quando botão SIM for clicado', () => {
    render(
      <VotacaoForm 
        associadoId={123}
        pautaId={456}
        votando={false}
        erro={null}
        onVotar={mockOnVotar}
      />
    );
    
    const botaoSim = screen.getByText('SIM');
    fireEvent.click(botaoSim);
    
    expect(mockOnVotar).toHaveBeenCalledWith(OpcaoVoto.SIM);
  });

  it('deve chamar onVotar com opção NAO quando botão NÃO for clicado', () => {
    render(
      <VotacaoForm 
        associadoId={123}
        pautaId={456}
        votando={false}
        erro={null}
        onVotar={mockOnVotar}
      />
    );
    
    const botaoNao = screen.getByText('NÃO');
    fireEvent.click(botaoNao);
    
    expect(mockOnVotar).toHaveBeenCalledWith(OpcaoVoto.NAO);
  });

  it('deve desabilitar os botões quando estiver votando', () => {
    render(
      <VotacaoForm 
        associadoId={123}
        pautaId={456}
        votando={true}
        erro={null}
        onVotar={mockOnVotar}
      />
    );
    
    const botoes = screen.getAllByRole('button');
    botoes.forEach(botao => {
      expect(botao).toBeDisabled();
    });
  
    const botoesVotando = screen.getAllByText('Votando...');
    expect(botoesVotando).toHaveLength(2); 
  });
});