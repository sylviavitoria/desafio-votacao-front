import type { FormEvent } from 'react';
import GenericForm from './GenericForm';

interface FormErrors {
  nome?: string;
  cpf?: string;
  email?: string;
  form?: string;
}

interface AssociadoFormProps {
  formData: {
    nome: string;
    cpf: string;
    email: string;
    id?: number;
  };
  errors: FormErrors;
  enviando: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel?: { idle: string; enviando: string };
}

const AssociadoForm = ({ 
  formData, 
  errors, 
  enviando, 
  onChange, 
  onSubmit,
  submitLabel = { idle: 'Cadastrar', enviando: 'Cadastrando...' }
}: AssociadoFormProps) => {
  const campos = [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text' as const
    },
    {
      name: 'cpf',
      label: 'CPF',
      type: 'text' as const
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text' as const 
    }
  ];

  return (
    <GenericForm
      formData={formData}
      errors={errors}
      enviando={enviando}
      campos={campos}
      submitLabel={submitLabel}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default AssociadoForm;