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
  };
  errors: FormErrors;
  enviando: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const AssociadoForm = ({ formData, errors, enviando, onChange, onSubmit }: AssociadoFormProps) => {
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
      submitLabel={{ idle: 'Cadastrar', enviando: 'Cadastrando...' }}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default AssociadoForm;