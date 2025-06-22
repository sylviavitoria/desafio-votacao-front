import { render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import EditarAssociado from '../EditarAssociado';
import useAssociadoDetalhes from '../../hooks/useAssociadoDetalhes';
import useFormAssociado from '../../hooks/useFormAssociado';
import { Associado } from '../../types/Associado';

jest.mock('../../hooks/useAssociadoDetalhes');
jest.mock('../../hooks/useFormAssociado');
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

jest.mock('../form/AssociadoForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="associado-form-mock">AssociadoForm Mock</div>
  };
});

describe('EditarAssociado', () => {
  const mockAssociado: Associado = {
    id: 1,
    nome: 'João Silva',
    cpf: '12345678901',
    email: 'joao@example.com'
  };
  
  const mockErrors = { nome: undefined, cpf: undefined, email: undefined };
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockSetFormData = jest.fn();
 
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    
    (useAssociadoDetalhes as jest.Mock).mockReturnValue({
      associado: mockAssociado,
      carregando: false,
      erro: null,
      carregarAssociado: jest.fn()
    });
    
    (useFormAssociado as jest.Mock).mockReturnValue({
      formData: mockAssociado,
      errors: mockErrors,
      enviando: false,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData
    });
  });

  it('deve renderizar o componente corretamente', () => {
    render(<EditarAssociado />);

    expect(screen.getByTestId('editar-entidade-mock')).toBeInTheDocument();

    expect(screen.getByText('Editar Associado')).toBeInTheDocument();
  });

  it('deve passar os dados do associado para o EditarEntidade', () => {
    render(<EditarAssociado />);

    const formDataEl = screen.getByTestId('form-data');
    expect(formDataEl.textContent).toContain('"nome":"João Silva"');
    expect(formDataEl.textContent).toContain('"cpf":"12345678901"');
    expect(formDataEl.textContent).toContain('"email":"joao@example.com"');

    expect(screen.getByTestId('associado-form-mock')).toBeInTheDocument();

    expect(screen.getByTestId('rota-voltar').textContent).toBe('listar-associados');
  });

  it('deve mostrar indicador de carregamento enquanto carrega os dados', () => {

    (useAssociadoDetalhes as jest.Mock).mockReturnValue({
      associado: null,
      carregando: true,
      erro: null,
      carregarAssociado: jest.fn()
    });
    
    render(<EditarAssociado />);
    
    expect(screen.getByTestId('carregando-detalhes').textContent).toBe('true');
  });

  it('deve exibir mensagem de erro quando falha ao carregar os detalhes', () => {

    (useAssociadoDetalhes as jest.Mock).mockReturnValue({
      associado: null,
      carregando: false,
      erro: 'Erro ao carregar associado',
      carregarAssociado: jest.fn()
    });
    
    render(<EditarAssociado />);
    
    expect(screen.getByTestId('erro-detalhes').textContent).toBe('Erro ao carregar associado');
  });

  it('deve definir os dados do formulário quando o associado é carregado', () => {
    render(<EditarAssociado />);
    
    expect(mockSetFormData).toHaveBeenCalledWith(mockAssociado);
  });

  it('deve exibir o estado de enviando corretamente', () => {

    (useFormAssociado as jest.Mock).mockReturnValue({
      formData: mockAssociado,
      errors: mockErrors,
      enviando: true,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData
    });
    
    render(<EditarAssociado />);
    expect(screen.getByTestId('enviando').textContent).toBe('true');
  });

  it('deve exibir o estado de enviado corretamente', () => {

    (useFormAssociado as jest.Mock).mockReturnValue({
      formData: mockAssociado,
      errors: mockErrors,
      enviando: false,
      enviado: true,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData
    });
    
    render(<EditarAssociado />);
    expect(screen.getByTestId('enviado').textContent).toBe('true');
  });
});