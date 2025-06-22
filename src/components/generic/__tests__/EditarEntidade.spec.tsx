import { render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import EditarEntidade from '../../generic/EditarEntidade';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

const MockFormComponent = ({
  formData,
  errors,
  enviando,
  onChange,
  onSubmit,
  submitLabel
}) => (
  <div data-testid="mock-form">
    <div data-testid="form-data">{JSON.stringify(formData)}</div>
    <div data-testid="form-errors">{JSON.stringify(errors)}</div>
    <div data-testid="form-enviando">{enviando.toString()}</div>
    <div data-testid="form-submit-label">{JSON.stringify(submitLabel)}</div>
    <form onSubmit={onSubmit}>
      <button
        data-testid="form-button"
        type="submit"
      >
        {submitLabel.idle}
      </button>
      <input
        data-testid="form-input"
        name="testField"
        value={formData.testField || ''}
        onChange={onChange}
      />
    </form>
  </div>
);

describe('EditarEntidade', () => {

  const mockFormData = { testField: 'valor de teste' };
  const mockErrors = { testField: undefined, form: undefined };
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('deve renderizar o componente com o título correto', () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes={null}
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    expect(screen.getByText('Editar Entidade Teste')).toBeInTheDocument();
  });

  it('deve mostrar indicador de carregamento quando carregandoDetalhes é true', () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={true}
        erroDetalhes={null}
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
    expect(screen.queryByText('Editar Entidade Teste')).not.toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando erroDetalhes não é null', () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes="Erro ao carregar detalhes"
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    expect(screen.getByText('Erro ao Carregar Dados')).toBeInTheDocument();
    expect(screen.getByText('Erro ao carregar detalhes')).toBeInTheDocument();
    expect(screen.getByText('Voltar para listagem')).toBeInTheDocument();
  });

  it('deve navegar para a rota correta ao clicar em voltar quando há erro', async () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes="Erro ao carregar detalhes"
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    const botaoVoltar = screen.getByText('Voltar para listagem');
    await userEvent.click(botaoVoltar);

    expect(mockNavigate).toHaveBeenCalledWith('/rota-teste');
  });

  it('deve passar as propriedades corretas para o FormComponent', () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes={null}
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    const formDataElement = screen.getByTestId('form-data');
    expect(formDataElement.textContent).toContain('valor de teste');

    const submitLabelElement = screen.getByTestId('form-submit-label');
    expect(submitLabelElement.textContent).toContain('Atualizar');
    expect(submitLabelElement.textContent).toContain('Atualizando');
  });

  it('deve mostrar mensagem de sucesso quando enviado for true', () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes={null}
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={true}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    expect(screen.getByText('Dados atualizados com sucesso!')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando houver erro no formulário', () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes={null}
        formData={mockFormData}
        errors={{ ...mockErrors, form: 'Erro no formulário' }}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    expect(screen.getByText('Erro no formulário')).toBeInTheDocument();
  });

  it('deve chamar handleSubmit quando o formulário é enviado', async () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes={null}
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    const button = screen.getByTestId('form-button');
    await userEvent.click(button);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('deve chamar handleChange quando o input é alterado', async () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes={null}
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    const input = screen.getByTestId('form-input');
    await userEvent.type(input, 'novo valor');

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('deve mostrar botão de cancelar e navegar para a rota correta ao clicar', async () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes={null}
        formData={mockFormData}
        errors={mockErrors}
        enviando={false}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    const botaoCancelar = screen.getByText('Cancelar');
    expect(botaoCancelar).toBeInTheDocument();

    await userEvent.click(botaoCancelar);
    expect(mockNavigate).toHaveBeenCalledWith('/rota-teste');
  });
  
  it('deve desabilitar o botão de cancelar quando enviando é true', () => {
    render(
      <EditarEntidade
        titulo="Editar Entidade Teste"
        carregandoDetalhes={false}
        erroDetalhes={null}
        formData={mockFormData}
        errors={mockErrors}
        enviando={true}
        enviado={false}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        rotaVoltar="rota-teste"
        FormComponent={MockFormComponent}
      />
    );

    const botaoCancelar = screen.getByText('Cancelar');
    expect(botaoCancelar).toBeDisabled();
  });
});