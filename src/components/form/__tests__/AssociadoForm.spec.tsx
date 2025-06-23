import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssociadoForm from '../AssociadoForm';

jest.mock('../GenericForm', () => {
  return {
    __esModule: true,
    default: ({ 
      formData, 
      errors, 
      enviando, 
      campos, 
      submitLabel, 
      onChange, 
      onSubmit
    }) => (
      <div data-testid="generic-form-mock">
        <div data-testid="form-data">{JSON.stringify(formData)}</div>
        <div data-testid="errors">{JSON.stringify(errors)}</div>
        <div data-testid="enviando">{enviando.toString()}</div>
        <div data-testid="campos">{JSON.stringify(campos)}</div>
        <div data-testid="submit-label">{JSON.stringify(submitLabel)}</div>
        <form onSubmit={onSubmit}>
          {campos.map((campo) => (
            <div key={campo.name} data-testid={`campo-${campo.name}`}>
              <label htmlFor={campo.name}>{campo.label}</label>
              <input
                id={campo.name}
                name={campo.name}
                value={formData[campo.name] || ''}
                onChange={onChange}
                data-testid={`input-${campo.name}`}
              />
            </div>
          ))}
          <button type="submit" data-testid="submit-button">
            {enviando ? submitLabel.enviando : submitLabel.idle}
          </button>
        </form>
      </div>
    )
  };
});

describe('AssociadoForm', () => {
  const mockFormData = {
    nome: 'Nome Teste',
    cpf: '12345678901',
    email: 'teste@exemplo.com'
  };
  
  const mockErrors = {
    nome: undefined,
    cpf: undefined,
    email: undefined
  };
  
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente corretamente', () => {
    render(
      <AssociadoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByTestId('generic-form-mock')).toBeInTheDocument();
  });

  it('deve passar os dados do formulário corretamente para o GenericForm', () => {
    render(
      <AssociadoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
      />
    );

    const formDataEl = screen.getByTestId('form-data');
    expect(JSON.parse(formDataEl.textContent!)).toEqual(mockFormData);
  });

  it('deve incluir os campos corretos', () => {
    render(
      <AssociadoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
      />
    );

    const camposEl = screen.getByTestId('campos');
    const campos = JSON.parse(camposEl.textContent!);

    expect(campos).toHaveLength(3);
    expect(campos[0]).toEqual({ name: 'nome', label: 'Nome', type: 'text' });
    expect(campos[1]).toEqual({ name: 'cpf', label: 'CPF', type: 'text' });
    expect(campos[2]).toEqual({ name: 'email', label: 'Email', type: 'text' });
  });

  it('deve usar os labels padrão para os botões', () => {
    render(
      <AssociadoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
      />
    );

    const submitLabelEl = screen.getByTestId('submit-label');
    const submitLabel = JSON.parse(submitLabelEl.textContent!);

    expect(submitLabel).toEqual({ idle: 'Cadastrar', enviando: 'Cadastrando...' });
  });

  it('deve permitir labels personalizados para os botões', () => {
    const customLabels = { idle: 'Salvar', enviando: 'Salvando...' };
    
    render(
      <AssociadoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        submitLabel={customLabels}
      />
    );

    const submitLabelEl = screen.getByTestId('submit-label');
    const submitLabel = JSON.parse(submitLabelEl.textContent!);

    expect(submitLabel).toEqual(customLabels);
  });

  it('deve chamar onChange quando um campo é alterado', async () => {
    render(
      <AssociadoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
      />
    );

    const nomeInput = screen.getByTestId('input-nome');
    await userEvent.type(nomeInput, 'a');

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('deve chamar onSubmit quando o formulário é enviado', async () => {
    render(
      <AssociadoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
      />
    );

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});