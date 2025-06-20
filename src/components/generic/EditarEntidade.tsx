import { useNavigate } from 'react-router-dom';
import { FormEvent, ChangeEvent, ComponentType } from 'react';

interface FormProps<T extends Record<string, unknown>> {
  formData: T;
  errors: Record<string, string | undefined>;
  enviando: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel: { idle: string; enviando: string };
  [key: string]: unknown;
}

interface EditarEntidadeProps<T extends Record<string, unknown>> {
  titulo: string;
  carregandoDetalhes: boolean;
  erroDetalhes: string | null;
  formData: T;
  errors: Record<string, string | undefined>;
  enviando: boolean;
  enviado: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  rotaVoltar: string;
  FormComponent: ComponentType<FormProps<T>>;
  formProps?: Omit<FormProps<T>, 'formData' | 'errors' | 'enviando' | 'onChange' | 'onSubmit' | 'submitLabel'>;
}

function EditarEntidade<T extends Record<string, unknown>>({
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
}: EditarEntidadeProps<T>) {
  const navigate = useNavigate();

  if (carregandoDetalhes) {
    return <p className="carregando">Carregando dados...</p>;
  }

  if (erroDetalhes) {
    return (
      <div className="editar-entidade">
        <h2>Erro ao Carregar Dados</h2>
        <div className="error-message">{erroDetalhes}</div>
        <button 
          className="botao-secundario" 
          onClick={() => navigate(`/${rotaVoltar}`)}
        >
          Voltar para listagem
        </button>
      </div>
    );
  }

  return (
    <div className="editar-entidade">
      <h2>{titulo}</h2>
      
      {enviado && (
        <div className="success-message">
          Dados atualizados com sucesso!
        </div>
      )}

      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      <FormComponent 
        formData={formData}
        errors={errors}
        enviando={enviando}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel={{ idle: 'Atualizar', enviando: 'Atualizando...' }}
        {...formProps}
      />

      <div className="botao-container" style={{ textAlign: 'center', padding: '1rem 0' }}>
        <button
          className="botao-secundario"
          onClick={() => navigate(`/${rotaVoltar}`)}
          disabled={enviando}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default EditarEntidade;