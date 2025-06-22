import { render, screen } from '@testing-library/react';
import CriarSessaoVotacao from '../CriarSessaoVotacao';
import useFormSessaoVotacao from '../../hooks/useFormSessaoVotacao';

jest.mock('../../hooks/useFormSessaoVotacao');

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
      FormComponent,
      formProps 
    }) => (
      <div data-testid="criar-entidade-mock">
        <h2>{titulo}</h2>
        <div data-testid="form-data">{JSON.stringify(formData)}</div>
        <div data-testid="erros">{JSON.stringify(errors)}</div>
        <div data-testid="enviando">{enviando.toString()}</div>
        <div data-testid="enviado">{enviado.toString()}</div>
        <div data-testid="form-props">{JSON.stringify(formProps)}</div>
        <FormComponent 
          formData={formData}
          errors={errors}
          enviando={enviando}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel={{ idle: 'Cadastrar', enviando: 'Cadastrando...' }}
          {...formProps}
        />
      </div>
    )
  };
});

jest.mock('../form/SessaoVotacaoForm', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="sessao-form-mock">SessaoVotacaoForm Mock</div>
  };
});

describe('CriarSessaoVotacao', () => {
  const mockFormData = {
    pautaId: 1,
    duracaoMinutos: 30
  };
  
  const mockErrors = { pautaId: undefined, duracaoMinutos: undefined };
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockSetModo = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    (useFormSessaoVotacao as jest.Mock).mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      enviando: false,
      enviado: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      modo: 'imediato',
      setModo: mockSetModo
    });
  });

  it('deve renderizar o componente corretamente', () => {
    render(<CriarSessaoVotacao pautaId={1} onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('criar-entidade-mock')).toBeInTheDocument();

    expect(screen.getByText('Iniciar Sessão de Votação')).toBeInTheDocument();
  });

  it('deve passar os dados corretos para o CriarEntidade', () => {
    render(<CriarSessaoVotacao pautaId={1} onSuccess={mockOnSuccess} />);

    const formDataEl = screen.getByTestId('form-data');
    expect(formDataEl.textContent).toContain('"pautaId":1');
    expect(formDataEl.textContent).toContain('"duracaoMinutos":30');
  
    expect(screen.getByTestId('sessao-form-mock')).toBeInTheDocument();
  });

  it('deve passar as props de modo corretamente para o formulário', () => {
    render(<CriarSessaoVotacao pautaId={1} onSuccess={mockOnSuccess} />);
    
    const formPropsEl = screen.getByTestId('form-props');
    expect(formPropsEl.textContent).toContain('"modo":"imediato"');
  });

  it('deve chamar useFormSessaoVotacao com as props corretas', () => {
    render(<CriarSessaoVotacao pautaId={1} onSuccess={mockOnSuccess} />);

    expect(useFormSessaoVotacao).toHaveBeenCalledWith({
      pautaId: 1,
      onSuccess: expect.any(Function)
    });
  });

  it('deve chamar o callback de sucesso quando a sessão for criada', () => {

    render(<CriarSessaoVotacao pautaId={1} onSuccess={mockOnSuccess} />);
    
    const onSuccessCallback = (useFormSessaoVotacao as jest.Mock).mock.calls[0][0].onSuccess;
    
    onSuccessCallback({ id: 1, pautaId: 1 });
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});