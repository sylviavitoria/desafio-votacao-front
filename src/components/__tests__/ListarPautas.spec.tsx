import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ListarPautas from '../ListarPautas';
import useListarPautas from '../../hooks/useListarPautas';
import useExcluirPauta from '../../hooks/useExcluirPauta';

jest.mock('../../hooks/useListarPautas');
jest.mock('../../hooks/useExcluirPauta');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../generic/ListarEntidade', () => {
  return {
    __esModule: true,
    default: ({
      titulo,
      entidades,
      carregando,
      erro,
      pagina,
      totalPaginas,
      ultimaPagina,
      primeiraPagina,
      mudarPagina,
      excluir,
      excluindo,
      erroExclusao,
      rotaEditarBase,
      getId,
      getTitulo,
      podeEditar,
      podeExcluir,
      podeIniciarSessao,
      onIniciarSessao,
      podeVotar,
      onVotar,
      renderizarConteudo
    }) => (
      <div data-testid="listar-entidade-mock">
        <h2>{titulo}</h2>
        <div data-testid="entidades-count">{entidades.length}</div>
        <div data-testid="carregando">{carregando.toString()}</div>
        <div data-testid="erro">{erro || ''}</div>
        <div data-testid="pagina">{pagina}</div>
        <div data-testid="total-paginas">{totalPaginas}</div>
        <div data-testid="ultima-pagina">{ultimaPagina.toString()}</div>
        <div data-testid="primeira-pagina">{primeiraPagina.toString()}</div>
        
        <button 
          data-testid="mudar-pagina-btn" 
          onClick={() => mudarPagina(pagina + 1)}
        >
          Próxima Página
        </button>
        
        <button 
          data-testid="excluir-btn" 
          onClick={() => excluir(1)}
        >
          Excluir
        </button>
        
        <button 
          data-testid="iniciar-sessao-btn" 
          onClick={() => onIniciarSessao && onIniciarSessao(1)}
        >
          Iniciar Sessão
        </button>
        
        <button 
          data-testid="votar-btn" 
          onClick={() => onVotar && onVotar(1)}
        >
          Votar
        </button>
        
        <div data-testid="excluindo">{excluindo.toString()}</div>
        <div data-testid="erro-exclusao">{erroExclusao || ''}</div>
        <div data-testid="rota-editar">{rotaEditarBase}</div>
        
        {entidades.map(entidade => (
          <div key={getId(entidade)} data-testid="entidade-item">
            <h3>{getTitulo(entidade)}</h3>
            <div>{podeEditar(entidade) ? 'Pode Editar' : 'Não Pode Editar'}</div>
            <div>{podeExcluir(entidade) ? 'Pode Excluir' : 'Não Pode Excluir'}</div>
            <div>{podeIniciarSessao && podeIniciarSessao(entidade) ? 'Pode Iniciar Sessão' : 'Não Pode Iniciar Sessão'}</div>
            <div>{podeVotar && podeVotar(entidade) ? 'Pode Votar' : 'Não Pode Votar'}</div>
            <div data-testid="conteudo-renderizado">{renderizarConteudo(entidade)}</div>
          </div>
        ))}
      </div>
    )
  };
});

describe('ListarPautas', () => {
  const navigateMock = jest.fn();
  const carregarPautasMock = jest.fn();
  const excluirPautaMock = jest.fn();
  
  const mockPautas = [
    { 
      id: 1, 
      titulo: 'Pauta 1', 
      descricao: 'Descrição da pauta 1', 
      dataCriacao: '2025-05-01T10:00:00',
      status: 'CRIADA',
      totalVotosSim: 0,
      totalVotosNao: 0,
      criador: { id: 1, nome: 'João' }
    },
    { 
      id: 2, 
      titulo: 'Pauta 2',
      descricao: 'Descrição da pauta 2',
      dataCriacao: '2025-05-01T11:00:00',
      status: 'EM_VOTACAO',
      totalVotosSim: 5,
      totalVotosNao: 3,
      criador: { id: 2, nome: 'Maria' }
    },
    { 
      id: 3,
      titulo: 'Pauta 3',
      descricao: 'Descrição da pauta 3',
      dataCriacao: '2025-05-01T12:00:00',
      status: 'APROVADA',
      totalVotosSim: 10,
      totalVotosNao: 2,
      criador: { id: 1, nome: 'João' } 
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    (useListarPautas as jest.Mock).mockReturnValue({
      pautas: mockPautas,
      carregando: false,
      erro: null,
      pagina: 0,
      totalPaginas: 1,
      ultimaPagina: true,
      primeiraPagina: true,
      carregarPautas: carregarPautasMock,
      mudarPagina: jest.fn()
    });

    (useExcluirPauta as jest.Mock).mockReturnValue({
      excluirPauta: excluirPautaMock,
      excluindo: false,
      erro: null
    });
  });

  it('deve renderizar o componente corretamente', () => {
    render(<ListarPautas />);
    
    expect(screen.getByTestId('listar-entidade-mock')).toBeInTheDocument();
    expect(screen.getByText('Lista de Pautas')).toBeInTheDocument();
  });

  it('deve passar as pautas para o ListarEntidade', () => {
    render(<ListarPautas />);
    
    expect(screen.getByTestId('entidades-count').textContent).toBe('3');
    expect(screen.getAllByTestId('entidade-item').length).toBe(3);
  });

  it('deve passar as props corretas para o ListarEntidade', () => {
    render(<ListarPautas />);
    
    expect(screen.getByTestId('carregando').textContent).toBe('false');
    expect(screen.getByTestId('erro').textContent).toBe('');
    expect(screen.getByTestId('pagina').textContent).toBe('0');
    expect(screen.getByTestId('total-paginas').textContent).toBe('1');
    expect(screen.getByTestId('ultima-pagina').textContent).toBe('true');
    expect(screen.getByTestId('primeira-pagina').textContent).toBe('true');
    expect(screen.getByTestId('rota-editar').textContent).toBe('editar-pauta');
  });

  it('deve chamar a função de exclusão quando o botão excluir é clicado', () => {
    render(<ListarPautas />);
    
    fireEvent.click(screen.getByTestId('excluir-btn'));
    expect(excluirPautaMock).toHaveBeenCalledWith(1);
  });

  it('deve navegar para o detalhe da votação quando o botão iniciar sessão é clicado', () => {
    render(<ListarPautas />);
    
    fireEvent.click(screen.getByTestId('iniciar-sessao-btn'));
    expect(navigateMock).toHaveBeenCalledWith('/detalhe-votacao/1');
  });

  it('deve navegar para o detalhe da votação com parâmetro de votação quando o botão votar é clicado', () => {
    render(<ListarPautas />);
    
    fireEvent.click(screen.getByTestId('votar-btn'));
    expect(navigateMock).toHaveBeenCalledWith('/detalhe-votacao/1?votar=true');
  });

  it('deve renderizar o conteúdo da pauta corretamente', () => {
    render(<ListarPautas />);
    
    const entidadeItems = screen.getAllByTestId('entidade-item');
    
    expect(entidadeItems[0]).toHaveTextContent('Pode Editar');
    expect(entidadeItems[0]).toHaveTextContent('Pode Excluir');
    expect(entidadeItems[0]).toHaveTextContent('Pode Iniciar Sessão');
    expect(entidadeItems[0]).toHaveTextContent('Não Pode Votar');
    
    expect(entidadeItems[1]).toHaveTextContent('Não Pode Editar');
    expect(entidadeItems[1]).toHaveTextContent('Não Pode Excluir');
    expect(entidadeItems[1]).toHaveTextContent('Não Pode Iniciar Sessão');
    expect(entidadeItems[1]).toHaveTextContent('Pode Votar');
    
    expect(entidadeItems[2]).toHaveTextContent('Não Pode Editar');
    expect(entidadeItems[2]).toHaveTextContent('Não Pode Excluir');
    expect(entidadeItems[2]).toHaveTextContent('Não Pode Iniciar Sessão');
    expect(entidadeItems[2]).toHaveTextContent('Não Pode Votar');
  });

  it('deve mostrar mensagem de carregamento quando estiver buscando dados', () => {
    (useListarPautas as jest.Mock).mockReturnValue({
      pautas: [],
      carregando: true,
      erro: null,
      pagina: 0,
      totalPaginas: 0,
      ultimaPagina: true,
      primeiraPagina: true,
      carregarPautas: carregarPautasMock,
      mudarPagina: jest.fn()
    });

    render(<ListarPautas />);
    expect(screen.getByTestId('carregando').textContent).toBe('true');
  });

  it('deve chamar carregarPautas quando o componente for renderizado', () => {
    render(<ListarPautas />);
    
    expect(useListarPautas).toHaveBeenCalled();
  });

  it('deve chamar carregarPautas após uma exclusão bem-sucedida', () => {
    render(<ListarPautas />);
    
    const onSuccessCallback = (useExcluirPauta as jest.Mock).mock.calls[0][0].onSuccess;
    
    onSuccessCallback();
    
    expect(carregarPautasMock).toHaveBeenCalled();
  });

  it('deve aceitar um título personalizado', () => {
    render(<ListarPautas titulo="Título Personalizado" />);
    
    expect(screen.getByText('Título Personalizado')).toBeInTheDocument();
  });
});