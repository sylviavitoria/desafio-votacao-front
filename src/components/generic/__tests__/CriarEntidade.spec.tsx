import { render, screen, fireEvent } from '@testing-library/react';
import CriarEntidade from '../CriarEntidade';

const MockFormComponent = ({ 
  formData, 
  errors, 
  onChange, 
  onSubmit, 
  submitLabel 
}) => (
  <form data-testid="mock-form" onSubmit={onSubmit}>
    <input 
      data-testid="mock-input" 
      name="testField" 
      value={formData.testField || ''} 
      onChange={onChange} 
    />
    {errors.testField && <div data-testid="field-error">{errors.testField}</div>}
    {errors.form && <div data-testid="form-error">{errors.form}</div>}
    <button type="submit">
      {submitLabel.idle}
    </button>
  </form>
);

describe('CriarEntidade', () => {
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  
  const defaultProps = {
    titulo: 'Criar Teste',
    formData: { testField: 'valor teste' },
    errors: {},
    enviando: false,
    enviado: false,
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
    FormComponent: MockFormComponent
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título corretamente', () => {
    render(<CriarEntidade {...defaultProps} />);
    expect(screen.getByText('Criar Teste')).toBeInTheDocument();
  });

  it('deve exibir mensagem de sucesso quando enviado for true', () => {
    render(<CriarEntidade {...defaultProps} enviado={true} />);
    expect(screen.getByText('Cadastro realizado com sucesso!')).toBeInTheDocument();
  });

  it('deve exibir erro do formulário quando houver', () => {
    const props = {
      ...defaultProps,
      errors: { form: 'Erro no formulário' }
    };
    
    render(<CriarEntidade {...props} />);
    
    const errorElement = document.querySelector('.criar-entidade > .error-message');
    expect(errorElement).toHaveTextContent('Erro no formulário');
  });

  it('deve passar as props corretas para o componente de formulário', () => {
    render(<CriarEntidade {...defaultProps} />);
    
    const input = screen.getByTestId('mock-input');
    expect(input).toHaveValue('valor teste');
    

    fireEvent.change(input, { target: { value: 'novo valor' } });
    expect(mockHandleChange).toHaveBeenCalled();
    

    fireEvent.submit(screen.getByTestId('mock-form'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});