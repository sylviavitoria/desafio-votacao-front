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

interface CriarEntidadeProps<T extends Record<string, unknown>> {
  titulo: string;
  formData: T;
  errors: Record<string, string | undefined>;
  enviando: boolean;
  enviado: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  FormComponent: ComponentType<FormProps<T>>;
  formProps?: Omit<FormProps<T>, 'formData' | 'errors' | 'enviando' | 'onChange' | 'onSubmit' | 'submitLabel'>;
}

function CriarEntidade<T extends Record<string, unknown>>({
  titulo,
  formData,
  errors,
  enviando,
  enviado,
  handleChange,
  handleSubmit,
  FormComponent,
  formProps = {}
}: CriarEntidadeProps<T>) {
  return (
    <div className="criar-entidade">
      <h1>{titulo}</h1>
      
      {enviado && (
        <div className="success-message">
          Cadastro realizado com sucesso!
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
        submitLabel={{ idle: 'Cadastrar', enviando: 'Cadastrando...' }}
        {...formProps}
      />
    </div>
  );
}

export default CriarEntidade;