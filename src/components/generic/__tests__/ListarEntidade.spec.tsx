import { render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ListarEntidade from '../../generic/ListarEntidade';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../../Card', () => {
  return jest.fn(({ 
    titulo, 
    children, 
    onEdit, 
    onDelete, 
    onIniciarSessao,
    onVotar
  }) => (
    <div data-testid="card-mock" className="card-mock">
      <h3>{titulo}</h3>
      <div>{children}</div>
      {onEdit && (
        <button 
          onClick={onEdit} 
          data-testid="card-edit-button"
        >
          Editar
        </button>
      )}
      {onDelete && (
        <button 
          onClick={onDelete} 
          data-testid="card-delete-button"
        >
          Excluir
        </button>
      )}
      {onIniciarSessao && (
        <button 
          onClick={onIniciarSessao} 
          data-testid="card-iniciar-sessao-button"
        >
          Iniciar Sessão
        </button>
      )}
      {onVotar && (
        <button 
          onClick={onVotar} 
          data-testid="card-votar-button"
        >
          Votar
        </button>
      )}
    </div>
  ));
});

describe('ListarEntidade', () => {

  const mockEntidades = [
    { id: 1, titulo: 'Entidade 1', status: 'ativo' },
    { id: 2, titulo: 'Entidade 2', status: 'inativo' },
    { id: 3, titulo: 'Entidade 3', status: 'ativo' }
  ];
  const mockNavigate = jest.fn();
  const mockExcluir = jest.fn().mockResolvedValue(true);
  const mockMudarPagina = jest.fn();
  const mockRenderizarConteudo = jest.fn(item => (
    <div data-testid={`entidade-${item.id}`}>{item.status}</div>
  ));

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('deve renderizar o componente com o título correto', () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={mockEntidades}
        carregando={false}
        erro={null}
        pagina={0}
        totalPaginas={1}
        ultimaPagina={true}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    expect(screen.getByText('Lista de Teste')).toBeInTheDocument();
  });

  it('deve mostrar indicador de carregamento quando carregando é true', () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={[]}
        carregando={true}
        erro={null}
        pagina={0}
        totalPaginas={1}
        ultimaPagina={true}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
    expect(screen.queryByText('Lista de Teste')).not.toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando erro não é null', () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={[]}
        carregando={false}
        erro="Erro ao carregar entidades"
        pagina={0}
        totalPaginas={1}
        ultimaPagina={true}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    expect(screen.getByText('Erro ao carregar entidades')).toBeInTheDocument();
  });

  it('deve mostrar mensagem quando lista está vazia', () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={[]}
        carregando={false}
        erro={null}
        pagina={0}
        totalPaginas={1}
        ultimaPagina={true}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument();
  });

  it('deve renderizar os cards para cada entidade', () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={mockEntidades}
        carregando={false}
        erro={null}
        pagina={0}
        totalPaginas={1}
        ultimaPagina={true}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    expect(screen.getByText('Entidade 1')).toBeInTheDocument();
    expect(screen.getByText('Entidade 2')).toBeInTheDocument();
    expect(screen.getByText('Entidade 3')).toBeInTheDocument();

    expect(mockRenderizarConteudo).toHaveBeenCalledTimes(3);
  });

  it('deve chamar a função de editar com o ID correto', async () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={mockEntidades}
        carregando={false}
        erro={null}
        pagina={0}
        totalPaginas={1}
        ultimaPagina={true}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    const editButtons = screen.getAllByTestId('card-edit-button');
    await userEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/editar-teste/1');
  });

  it('deve chamar a função de excluir com o ID correto', async () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={mockEntidades}
        carregando={false}
        erro={null}
        pagina={0}
        totalPaginas={1}
        ultimaPagina={true}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    const deleteButtons = screen.getAllByTestId('card-delete-button');
    await userEvent.click(deleteButtons[0]);

    expect(mockExcluir).toHaveBeenCalledWith(1);
  });

  it('deve mostrar e usar corretamente os controles de paginação', async () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={mockEntidades}
        carregando={false}
        erro={null}
        pagina={1}
        totalPaginas={3}
        ultimaPagina={false}
        primeiraPagina={false}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
    
    const nextButton = screen.getByText('Próxima');
    await userEvent.click(nextButton);
    expect(mockMudarPagina).toHaveBeenCalledWith(2);

    const prevButton = screen.getByText('Anterior');
    await userEvent.click(prevButton);
    expect(mockMudarPagina).toHaveBeenCalledWith(0);
  });

  it('deve desabilitar o botão de anterior quando estiver na primeira página', () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={mockEntidades}
        carregando={false}
        erro={null}
        pagina={0}
        totalPaginas={3}
        ultimaPagina={false}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    const prevButton = screen.getByText('Anterior');
    expect(prevButton).toBeDisabled();
  });

  it('deve desabilitar o botão de próxima quando estiver na última página', () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={mockEntidades}
        carregando={false}
        erro={null}
        pagina={2}
        totalPaginas={3}
        ultimaPagina={true}
        primeiraPagina={false}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={() => true}
        podeExcluir={() => true}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    const nextButton = screen.getByText('Próxima');
    expect(nextButton).toBeDisabled();
  });

  it('deve mostrar ou esconder botões de ação baseado nas funções de permissão', () => {
    render(
      <ListarEntidade
        titulo="Lista de Teste"
        entidades={mockEntidades}
        carregando={false}
        erro={null}
        pagina={0}
        totalPaginas={1}
        ultimaPagina={true}
        primeiraPagina={true}
        mudarPagina={mockMudarPagina}
        excluir={mockExcluir}
        excluindo={false}
        erroExclusao={null}
        rotaEditarBase="editar-teste"
        getId={item => item.id}
        getTitulo={item => item.titulo}
        podeEditar={item => item.status === 'ativo'}
        podeExcluir={item => item.status === 'ativo'}
        renderizarConteudo={mockRenderizarConteudo}
      />
    );

    const editButtons = screen.getAllByTestId('card-edit-button');
    expect(editButtons.length).toBe(2);
    
    const deleteButtons = screen.getAllByTestId('card-delete-button');
    expect(deleteButtons.length).toBe(2);
  });
});