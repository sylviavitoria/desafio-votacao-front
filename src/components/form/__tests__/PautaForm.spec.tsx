import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PautaForm from '../PautaForm';

interface Campo {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: Array<{ value: string | number, label: string }>;
  help?: string;
  rows?: number;
}

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
          {campos.map((campo: Campo) => (
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

describe('PautaForm', () => {
  const mockFormData = {
    titulo: 'Título da Pauta',
    descricao: 'Descrição da pauta de teste',
    criadorId: 5
  };
  
  const mockErrors = {
    titulo: undefined,
    descricao: undefined,
    criadorId: undefined
  };
  
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente corretamente', () => {
    render(
      <PautaForm
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
      <PautaForm
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

  it('deve incluir o campo criadorId quando não estiver em modo de edição', () => {
    render(
      <PautaForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modoEdicao={false}
      />
    );

    const camposEl = screen.getByTestId('campos');
    const campos = JSON.parse(camposEl.textContent!);

    expect(campos).toHaveLength(3);
    expect(campos[0]).toEqual({ name: 'titulo', label: 'Título', type: 'text' });
    expect(campos[1]).toEqual({ name: 'descricao', label: 'Descrição', type: 'textarea', rows: 5 });
    expect(campos[2]).toEqual({ name: 'criadorId', label: 'ID do Criador', type: 'text' });
  });

  it('deve não incluir o campo criadorId quando estiver em modo de edição', () => {
    render(
      <PautaForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modoEdicao={true}
      />
    );

    const camposEl = screen.getByTestId('campos');
    const campos = JSON.parse(camposEl.textContent!);

    expect(campos).toHaveLength(2);
    expect(campos[0]).toEqual({ name: 'titulo', label: 'Título', type: 'text' });
    expect(campos[1]).toEqual({ name: 'descricao', label: 'Descrição', type: 'textarea', rows: 5 });
    expect(campos.find((c: Campo) => c.name === 'criadorId')).toBeUndefined();
  });

  it('deve usar os labels padrão para os botões', () => {
    render(
      <PautaForm
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
      <PautaForm
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
      <PautaForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
      />
    );

    const tituloInput = screen.getByTestId('input-titulo');
    await userEvent.type(tituloInput, 'a');

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('deve chamar onSubmit quando o formulário é enviado', async () => {
    render(
      <PautaForm
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