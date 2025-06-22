import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessaoVotacaoForm from '../SessaoVotacaoForm';

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

describe('SessaoVotacaoForm', () => {
  const mockFormData = {
    pautaId: 10,
    duracaoMinutos: 30,
    dataInicio: '2025-06-25T10:00:00',
    dataFim: '2025-06-25T11:00:00'
  };
  
  const mockErrors = {
    pautaId: undefined,
    duracaoMinutos: undefined,
    dataInicio: undefined,
    dataFim: undefined
  };
  
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());
  const mockSetModo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente corretamente no modo imediato', () => {
    render(
      <SessaoVotacaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="imediato"
        setModo={mockSetModo}
      />
    );

    expect(screen.getByTestId('generic-form-mock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abertura Imediata' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agendamento' })).toBeInTheDocument();
  });

  it('deve mostrar apenas o campo de duração de minutos no modo imediato', () => {
    render(
      <SessaoVotacaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="imediato"
        setModo={mockSetModo}
      />
    );

    const camposEl = screen.getByTestId('campos');
    const campos = JSON.parse(camposEl.textContent!);

    expect(campos).toHaveLength(1);
    expect(campos[0]).toEqual({
      name: 'duracaoMinutos',
      label: 'Duração (minutos)',
      type: 'text',
      help: 'Tempo de duração da sessão em minutos. Se não informado, será usado 1 minuto.'
    });
  });

  it('deve mostrar os campos de data de início e fim no modo agendado', () => {
    render(
      <SessaoVotacaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="agendado"
        setModo={mockSetModo}
      />
    );

    const camposEl = screen.getByTestId('campos');
    const campos = JSON.parse(camposEl.textContent!);

    expect(campos).toHaveLength(2);
    expect(campos[0]).toEqual({
      name: 'dataInicio',
      label: 'Data e Hora de Início',
      type: 'text',
      help: 'Formato: YYYY-MM-DDThh:mm:ss (ex: 2025-05-25T22:00:00)'
    });
    expect(campos[1]).toEqual({
      name: 'dataFim',
      label: 'Data e Hora de Fim',
      type: 'text',
      help: 'Formato: YYYY-MM-DDThh:mm:ss (ex: 2025-05-26T11:00:00)'
    });
  });

  it('deve trocar para o modo imediato ao clicar no botão correspondente', async () => {
    render(
      <SessaoVotacaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="agendado"
        setModo={mockSetModo}
      />
    );

    const botaoImediato = screen.getByRole('button', { name: 'Abertura Imediata' });
    await userEvent.click(botaoImediato);

    expect(mockSetModo).toHaveBeenCalledWith('imediato');
  });

  it('deve trocar para o modo agendado ao clicar no botão correspondente', async () => {
    render(
      <SessaoVotacaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="imediato"
        setModo={mockSetModo}
      />
    );

    const botaoAgendado = screen.getByRole('button', { name: 'Agendamento' });
    await userEvent.click(botaoAgendado);

    expect(mockSetModo).toHaveBeenCalledWith('agendado');
  });

  it('deve usar os labels padrão para os botões', () => {
    render(
      <SessaoVotacaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="imediato"
        setModo={mockSetModo}
      />
    );

    const submitLabelEl = screen.getByTestId('submit-label');
    const submitLabel = JSON.parse(submitLabelEl.textContent!);

    expect(submitLabel).toEqual({ idle: 'Iniciar Sessão', enviando: 'Iniciando...' });
  });

  it('deve permitir labels personalizados para os botões', () => {
    const customLabels = { idle: 'Começar', enviando: 'Começando...' };
    
    render(
      <SessaoVotacaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="imediato"
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
      <SessaoVotacaoForm
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        onChange={mockHandleChange}
        onSubmit={mockHandleSubmit}
        modo="imediato"
        setModo={mockSetModo}
      />
    );

    const duracaoInput = screen.getByTestId('input-duracaoMinutos');
    await userEvent.type(duracaoInput, '5');

    expect(mockHandleChange).toHaveBeenCalled();
  });
});