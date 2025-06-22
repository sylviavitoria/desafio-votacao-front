import { render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import EditarPauta from '../EditarPauta';
import usePautaDetalhes from '../../hooks/usePautaDetalhes';
import useFormPauta from '../../hooks/useFormPauta';
import { PautaResponse } from '../../types/Pauta';

jest.mock('../../hooks/usePautaDetalhes');
jest.mock('../../hooks/useFormPauta');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

jest.mock('../generic/EditarEntidade', () => {
  return {
    __esModule: true,
    default: ({ 
      titulo, 
      carregandoDetalhes,
      erroDetalhes,
      formData, 
      errors, 
      enviando, 
      enviado, 
      handleChange, 
      handleSubmit,
      rotaVoltar,
      FormComponent,
      formProps = {}
    }) => (
      <div data-testid="editar-entidade-mock">
        <h2>{titulo}</h2>
        <div data-testid="carregando-detalhes">{carregandoDetalhes.toString()}</div>
        <div data-testid="erro-detalhes">{erroDetalhes || 'sem-erro'}</div>
        <div data-testid="form-data">{JSON.stringify(formData)}</div>
        <div data-testid="erros">{JSON.stringify(errors)}</div>
        <div data-testid="enviando">{enviando.toString()}</div>
        <div data-testid="enviado">{enviado.toString()}</div>
        <div data-testid="rota-voltar">{rotaVoltar}</div>
        <div data-testid="form-props">{JSON.stringify(formProps)}</div>
        <FormComponent 
          formData={formData}
          errors={errors}
          enviando={enviando}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel={{ idle: 'Atualizar', enviando: 'Atualizando...' }}
          {...formProps}
        />
      </div>
    )
  };
});

jest.mock('../form/PautaForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="pauta-form-mock">PautaForm Mock</div>
  };
});

describe('EditarPauta', () => {
  const mockPauta: PautaResponse = {
    id: 1,
    titulo: 'Pauta de Teste',
    descricao: 'Descrição da pauta de teste',
    dataCriacao: '2025-06-15T10:00:00',
    status: 'CRIADA',
    totalVotosSim: 0,
    totalVotosNao: 0,
    criador: {
      id: 5,
      nome: 'José da Silva'
    }
  };
  
  const mockPautaForm = {
    titulo: 'Pauta de Teste',
    descricao: 'Descrição da pauta de teste',
    criadorId: 5,
    id: 1
  };
  
  const mockErrors = { titulo: undefined, descricao: undefined };
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockSetFormData = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    
    (usePautaDetalhes as jest.Mock).mockReturnValue({
      pauta: mockPauta,
      carregando: false,
      erro: null,
      carregarPauta: jest.fn()
    });
    
    (useFormPauta as jest.Mock).mockReturnValue({
      formData: mockPautaForm,
      errors: mockErrors,
      enviando: false,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData
    });
  });

  it('deve renderizar o componente corretamente', () => {
    render(<EditarPauta />);
    
    expect(screen.getByTestId('editar-entidade-mock')).toBeInTheDocument();
    
    expect(screen.getByText('Editar Pauta')).toBeInTheDocument();
  });

  it('deve passar os dados da pauta para o EditarEntidade', () => {
    render(<EditarPauta />);

    const formDataEl = screen.getByTestId('form-data');
    expect(formDataEl.textContent).toContain('"titulo":"Pauta de Teste"');
    expect(formDataEl.textContent).toContain('"descricao":"Descrição da pauta de teste"');
    expect(formDataEl.textContent).toContain('"criadorId":5');
    
    expect(screen.getByTestId('pauta-form-mock')).toBeInTheDocument();
    
    expect(screen.getByTestId('rota-voltar').textContent).toBe('listar-pautas');
    
    const formPropsEl = screen.getByTestId('form-props');
    expect(formPropsEl.textContent).toContain('"modoEdicao":true');
  });

  it('deve mostrar indicador de carregamento enquanto carrega os dados', () => {
    (usePautaDetalhes as jest.Mock).mockReturnValue({
      pauta: null,
      carregando: true,
      erro: null,
      carregarPauta: jest.fn()
    });
    
    render(<EditarPauta />);
    
    expect(screen.getByTestId('carregando-detalhes').textContent).toBe('true');
  });

  it('deve exibir mensagem de erro quando falha ao carregar os detalhes', () => {

    (usePautaDetalhes as jest.Mock).mockReturnValue({
      pauta: null,
      carregando: false,
      erro: 'Erro ao carregar pauta',
      carregarPauta: jest.fn()
    });
    
    render(<EditarPauta />);
    
    expect(screen.getByTestId('erro-detalhes').textContent).toBe('Erro ao carregar pauta');
  });

  it('deve definir os dados do formulário quando a pauta é carregada', () => {
    render(<EditarPauta />);
    
    expect(mockSetFormData).toHaveBeenCalledWith({
      titulo: mockPauta.titulo,
      descricao: mockPauta.descricao,
      criadorId: mockPauta.criador.id,
      id: mockPauta.id
    });
  });

  it('deve usar o ID da URL para carregar os dados corretos', () => {

    (useParams as jest.Mock).mockReturnValue({ id: '42' });
    
    (usePautaDetalhes as jest.Mock).mockClear();
    (useFormPauta as jest.Mock).mockClear();
    
    render(<EditarPauta />);
    
    expect(usePautaDetalhes).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }));
    expect(useFormPauta).toHaveBeenCalledWith(expect.objectContaining({ pautaId: 42 }));
  });

  it('deve exibir o estado de enviando corretamente', () => {
    (useFormPauta as jest.Mock).mockReturnValue({
      formData: mockPautaForm,
      errors: mockErrors,
      enviando: true,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData
    });
    
    render(<EditarPauta />);
    expect(screen.getByTestId('enviando').textContent).toBe('true');
  });

  it('deve exibir o estado de enviado corretamente', () => {
    (useFormPauta as jest.Mock).mockReturnValue({
      formData: mockPautaForm,
      errors: mockErrors,
      enviando: false,
      enviado: true,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData
    });
    
    render(<EditarPauta />);
    expect(screen.getByTestId('enviado').textContent).toBe('true');
  });
});