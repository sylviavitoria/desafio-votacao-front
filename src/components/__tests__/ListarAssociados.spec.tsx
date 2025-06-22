import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ListarAssociados from '../ListarAssociados';
import useListarAssociados from '../../hooks/useListarAssociados';
import useExcluirAssociado from '../../hooks/useExcluirAssociado';

jest.mock('../../hooks/useListarAssociados');
jest.mock('../../hooks/useExcluirAssociado');
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
        
        <div data-testid="excluindo">{excluindo.toString()}</div>
        <div data-testid="erro-exclusao">{erroExclusao || ''}</div>
        <div data-testid="rota-editar">{rotaEditarBase}</div>
        
        {entidades.map(entidade => (
          <div key={getId(entidade)} data-testid="entidade-item">
            <h3>{getTitulo(entidade)}</h3>
            <div>{podeEditar(entidade) ? 'Pode Editar' : 'Não Pode Editar'}</div>
            <div>{podeExcluir(entidade) ? 'Pode Excluir' : 'Não Pode Excluir'}</div>
            <div data-testid="conteudo-renderizado">{renderizarConteudo(entidade)}</div>
          </div>
        ))}
      </div>
    )
  };
});

describe('ListarAssociados', () => {
  const navigateMock = jest.fn();
  const carregarAssociadosMock = jest.fn();
  const excluirAssociadoMock = jest.fn();
  
  const mockAssociados = [
    { id: 1, nome: 'João Silva', email: 'joao@exemplo.com', cpf: '12345678901' },
    { id: 2, nome: 'Maria Santos', email: 'maria@exemplo.com', cpf: '10987654321' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    (useListarAssociados as jest.Mock).mockReturnValue({
      associados: mockAssociados,
      carregando: false,
      erro: null,
      pagina: 0,
      totalPaginas: 1,
      ultimaPagina: true,
      primeiraPagina: true,
      carregarAssociados: carregarAssociadosMock,
      mudarPagina: jest.fn()
    });

    (useExcluirAssociado as jest.Mock).mockReturnValue({
      excluirAssociado: excluirAssociadoMock,
      excluindo: false,
      erro: null
    });
  });

  it('deve renderizar o componente corretamente', () => {
    render(<ListarAssociados />);
    
    expect(screen.getByTestId('listar-entidade-mock')).toBeInTheDocument();
    expect(screen.getByText('Lista de Associados')).toBeInTheDocument();
  });

  it('deve passar os associados para o ListarEntidade', () => {
    render(<ListarAssociados />);
    
    expect(screen.getByTestId('entidades-count').textContent).toBe('2');
    expect(screen.getAllByTestId('entidade-item').length).toBe(2);
  });

  it('deve passar as props corretas para o ListarEntidade', () => {
    render(<ListarAssociados />);
    
    expect(screen.getByTestId('carregando').textContent).toBe('false');
    expect(screen.getByTestId('erro').textContent).toBe('');
    expect(screen.getByTestId('pagina').textContent).toBe('0');
    expect(screen.getByTestId('total-paginas').textContent).toBe('1');
    expect(screen.getByTestId('ultima-pagina').textContent).toBe('true');
    expect(screen.getByTestId('primeira-pagina').textContent).toBe('true');
    expect(screen.getByTestId('rota-editar').textContent).toBe('editar-associado');
  });

  it('deve chamar a função de exclusão quando o botão excluir é clicado', () => {
    render(<ListarAssociados />);
    
    fireEvent.click(screen.getByTestId('excluir-btn'));
    expect(excluirAssociadoMock).toHaveBeenCalledWith(1);
  });

  it('deve renderizar o conteúdo do associado corretamente', () => {
    render(<ListarAssociados />);
    
    const conteudoRenderizados = screen.getAllByTestId('conteudo-renderizado');
    expect(conteudoRenderizados[0]).toHaveTextContent('Email:');
    expect(conteudoRenderizados[0]).toHaveTextContent('joao@exemplo.com');
    expect(conteudoRenderizados[0]).toHaveTextContent('ID:');
    expect(conteudoRenderizados[0]).toHaveTextContent('1');
  });

  it('deve informar que todos os associados podem ser editados e excluídos', () => {
    render(<ListarAssociados />);
    
    const entidadeItems = screen.getAllByTestId('entidade-item');
    expect(entidadeItems[0]).toHaveTextContent('Pode Editar');
    expect(entidadeItems[0]).toHaveTextContent('Pode Excluir');
    expect(entidadeItems[1]).toHaveTextContent('Pode Editar');
    expect(entidadeItems[1]).toHaveTextContent('Pode Excluir');
  });

  it('deve mostrar mensagem de carregamento quando estiver buscando dados', () => {
    (useListarAssociados as jest.Mock).mockReturnValue({
      associados: [],
      carregando: true,
      erro: null,
      pagina: 0,
      totalPaginas: 0,
      ultimaPagina: true,
      primeiraPagina: true,
      carregarAssociados: carregarAssociadosMock,
      mudarPagina: jest.fn()
    });

    render(<ListarAssociados />);
    expect(screen.getByTestId('carregando').textContent).toBe('true');
  });

  it('deve chamar carregarAssociados quando o componente for renderizado', () => {
    render(<ListarAssociados />);
    
    expect(useListarAssociados).toHaveBeenCalled();
  });

  it('deve chamar carregarAssociados após uma exclusão bem-sucedida', () => {
    render(<ListarAssociados />);
    
    const onSuccessCallback = (useExcluirAssociado as jest.Mock).mock.calls[0][0].onSuccess;
    
    onSuccessCallback();
    
    expect(carregarAssociadosMock).toHaveBeenCalled();
  });
});