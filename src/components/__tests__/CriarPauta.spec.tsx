import { render, screen } from '@testing-library/react';
import CriarPauta from '../CriarPauta';
import useFormPauta from '../../hooks/useFormPauta';

jest.mock('../../hooks/useFormPauta');

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

jest.mock('../form/PautaForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="pauta-form-mock">PautaForm Mock</div>
  };
});

describe('CriarPauta', () => {
  const mockFormData = {
    titulo: 'Pauta de Teste',
    descricao: 'Descrição da pauta de teste',
    criadorId: 1
  };
  
  const mockErrors = { titulo: undefined, descricao: undefined, criadorId: undefined };
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    (useFormPauta as jest.Mock).mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      enviando: false,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit
    });
  });

  it('deve renderizar o componente corretamente', () => {
    render(<CriarPauta />);
    
    expect(screen.getByTestId('criar-entidade-mock')).toBeInTheDocument();
    
    expect(screen.getByText('Criar Pauta')).toBeInTheDocument();
  });

  it('deve passar os dados corretos para o CriarEntidade', () => {
    render(<CriarPauta />);
    
    const formDataEl = screen.getByTestId('form-data');
    expect(formDataEl.textContent).toContain('"titulo":"Pauta de Teste"');
    expect(formDataEl.textContent).toContain('"descricao":"Descrição da pauta de teste"');
    expect(formDataEl.textContent).toContain('"criadorId":1');
    
    expect(screen.getByTestId('pauta-form-mock')).toBeInTheDocument();
  });

  it('deve exibir o estado de enviando corretamente', () => {

    (useFormPauta as jest.Mock).mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      enviando: true,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit
    });
    
    render(<CriarPauta />);
    expect(screen.getByTestId('enviando').textContent).toBe('true');
  });

  it('deve exibir o estado de enviado corretamente', () => {
    (useFormPauta as jest.Mock).mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      enviando: false,
      enviado: true,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit
    });
    
    render(<CriarPauta />);
    expect(screen.getByTestId('enviado').textContent).toBe('true');
  });
});