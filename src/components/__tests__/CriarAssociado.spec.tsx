import { render, screen } from '@testing-library/react';
import CriarAssociado from '../CriarAssociado';
import useFormAssociado from '../../hooks/useFormAssociado';

jest.mock('../../hooks/useFormAssociado');

jest.mock('../generic/CriarEntidade', () => {
  return {
    __esModule: true,
    default: ({ 
      titulo, 
      formData, 
      errors, 
      enviando, 
      enviado, 
      handleChange, 
      handleSubmit,
      FormComponent 
    }) => (
      <div data-testid="criar-entidade-mock">
        <h2>{titulo}</h2>
        <div data-testid="form-data">{JSON.stringify(formData)}</div>
        <div data-testid="erros">{JSON.stringify(errors)}</div>
        <div data-testid="enviando">{enviando.toString()}</div>
        <div data-testid="enviado">{enviado.toString()}</div>

        <FormComponent 
          formData={formData}
          errors={errors}
          enviando={enviando}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel={{ idle: 'Cadastrar', enviando: 'Cadastrando...' }}
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

describe('CriarAssociado', () => {
  const mockFormData = {
    nome: 'Teste',
    cpf: '12345678901',
    email: 'teste@example.com'
  };
  
  const mockErrors = { nome: undefined, cpf: undefined, email: undefined };
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {

    (useFormAssociado as jest.Mock).mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      enviando: false,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit
    });
  });

  it('deve renderizar o componente corretamente', () => {
    render(<CriarAssociado />);
    
    expect(screen.getByTestId('criar-entidade-mock')).toBeInTheDocument();
    
    expect(screen.getByText('Criar Associado')).toBeInTheDocument();
  });

  it('deve passar os dados corretos para o CriarEntidade', () => {
    render(<CriarAssociado />);
    
    const formDataEl = screen.getByTestId('form-data');
    expect(formDataEl.textContent).toContain('"nome":"Teste"');
    expect(formDataEl.textContent).toContain('"cpf":"12345678901"');
    expect(formDataEl.textContent).toContain('"email":"teste@example.com"');
    
    expect(screen.getByTestId('associado-form-mock')).toBeInTheDocument();
  });

  it('deve exibir o estado de enviando corretamente', () => {
    (useFormAssociado as jest.Mock).mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      enviando: true,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit
    });
    
    render(<CriarAssociado />);
    expect(screen.getByTestId('enviando').textContent).toBe('true');
  });

  it('deve exibir o estado de enviado corretamente', () => {
    (useFormAssociado as jest.Mock).mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      enviando: false,
      enviado: true,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit
    });
    
    render(<CriarAssociado />);
    expect(screen.getByTestId('enviado').textContent).toBe('true');
  });
});