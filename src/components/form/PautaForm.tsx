import type { FormEvent } from 'react';
import GenericForm from './GenericForm';

interface FormErrors {
  titulo?: string;
  descricao?: string;
  criadorId?: string;
  form?: string;
}

interface PautaFormProps {
  formData: {
    titulo: string;
    descricao: string;
    criadorId: number | string;
    id?: number;
  };
  errors: FormErrors;
  enviando: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel?: { idle: string; enviando: string };
  modoEdicao?: boolean; 
}

const PautaForm = ({ 
  formData, 
  errors, 
  enviando, 
  onChange, 
  onSubmit,
  submitLabel = { idle: 'Cadastrar', enviando: 'Cadastrando...' },
  modoEdicao = false 
}: PautaFormProps) => {
  const camposBase = [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text' as const
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea' as const,
      rows: 5
    }
  ];
  
  const campoCriador = {
    name: 'criadorId',
    label: 'ID do Criador',
    type: 'text' as const 
  };
  
  const campos = modoEdicao ? camposBase : [...camposBase, campoCriador];

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

export default PautaForm;