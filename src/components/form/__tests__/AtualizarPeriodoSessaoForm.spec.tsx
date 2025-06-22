import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AtualizarPeriodoSessaoForm from '../AtualizarPeriodoSessaoForm';


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
        <form onSubmit={onSubmit} data-testid="form">
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

describe('AtualizarPeriodoSessaoForm', () => {
  const mockFormData = {
    minutosAdicionais: 30,
    dataFim: '2025-06-23T15:00:00'
  };
  
  const mockErrors = {
    minutosAdicionais: undefined,
    dataFim: undefined
  };
  
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());
  const mockSetModo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente corretamente no modo minutos', () => {
    render(
      <AtualizarPeriodoSessaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="minutos"
        setModo={mockSetModo}
      />
    );

    expect(screen.getByTestId('generic-form-mock')).toBeInTheDocument();
    expect(screen.getByText('Escolha como deseja atualizar o período:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar Minutos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nova Data de Fechamento' })).toBeInTheDocument();
  });

  it('deve mostrar apenas o campo de minutos adicionais no modo minutos', () => {
    render(
      <AtualizarPeriodoSessaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="minutos"
        setModo={mockSetModo}
      />
    );

    const camposEl = screen.getByTestId('campos');
    const campos = JSON.parse(camposEl.textContent!);

    expect(campos).toHaveLength(1);
    expect(campos[0]).toEqual({
      name: 'minutosAdicionais',
      label: 'Minutos a adicionar',
      type: 'text',
      help: 'Quantidade de minutos a serem adicionados ao período atual'
    });
  });

  it('deve mostrar apenas o campo de data de fim no modo data', () => {
    render(
      <AtualizarPeriodoSessaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="data"
        setModo={mockSetModo}
      />
    );

    const camposEl = screen.getByTestId('campos');
    const campos = JSON.parse(camposEl.textContent!);

    expect(campos).toHaveLength(1);
    expect(campos[0]).toEqual({
      name: 'dataFim',
      label: 'Nova Data de Fechamento',
      type: 'text',
      help: 'Formato: YYYY-MM-DDThh:mm:ss (ex: 2025-05-26T11:00:00)'
    });
  });

  it('deve trocar para o modo minutos ao clicar no botão correspondente', async () => {
    render(
      <AtualizarPeriodoSessaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="data"
        setModo={mockSetModo}
      />
    );

    const botaoMinutos = screen.getByRole('button', { name: 'Adicionar Minutos' });
    await userEvent.click(botaoMinutos);

    expect(mockSetModo).toHaveBeenCalledWith('minutos');
  });

  it('deve trocar para o modo data ao clicar no botão correspondente', async () => {
    render(
      <AtualizarPeriodoSessaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="minutos"
        setModo={mockSetModo}
      />
    );

    const botaoData = screen.getByRole('button', { name: 'Nova Data de Fechamento' });
    await userEvent.click(botaoData);

    expect(mockSetModo).toHaveBeenCalledWith('data');
  });

  it('deve usar os labels padrão para os botões', () => {
    render(
      <AtualizarPeriodoSessaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="minutos"
        setModo={mockSetModo}
      />
    );

    const submitLabelEl = screen.getByTestId('submit-label');
    const submitLabel = JSON.parse(submitLabelEl.textContent!);

    expect(submitLabel).toEqual({ idle: 'Atualizar Período', enviando: 'Atualizando...' });
  });

  it('deve permitir labels personalizados para os botões', () => {
    const customLabels = { idle: 'Salvar', enviando: 'Salvando...' };
    
    render(
      <AtualizarPeriodoSessaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="minutos"
        setModo={mockSetModo}
        submitLabel={customLabels}
      />
    );

    const submitLabelEl = screen.getByTestId('submit-label');
    const submitLabel = JSON.parse(submitLabelEl.textContent!);

    expect(submitLabel).toEqual(customLabels);
  });

  it('deve chamar onChange quando um campo é alterado', async () => {
    render(
      <AtualizarPeriodoSessaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="minutos"
        setModo={mockSetModo}
      />
    );

    const minutosInput = screen.getByTestId('input-minutosAdicionais');
    await userEvent.type(minutosInput, '5');

    expect(mockHandleChange).toHaveBeenCalled();
  });
});