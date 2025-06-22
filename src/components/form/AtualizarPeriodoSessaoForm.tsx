import { FormEvent } from 'react';
import GenericForm from './GenericForm';

interface FormErrors {
  minutosAdicionais?: string;
  dataFim?: string;
  form?: string;
}

interface AtualizarPeriodoSessaoFormProps {
  formData: {
    minutosAdicionais?: number | string;
    dataFim?: string;
  };
  errors: FormErrors;
  enviando: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel?: { idle: string; enviando: string };
  modo: 'minutos' | 'data';
  setModo: (modo: 'minutos' | 'data') => void;
}

const AtualizarPeriodoSessaoForm = ({
  formData,
  errors,
  enviando,
  onChange,
  onSubmit,
  submitLabel = { idle: 'Atualizar Período', enviando: 'Atualizando...' },
  modo,
  setModo
}: AtualizarPeriodoSessaoFormProps) => {
  const camposMinutos = [
    {
      name: 'minutosAdicionais',
      label: 'Minutos a adicionar',
      type: 'text' as const,
      help: 'Quantidade de minutos a serem adicionados ao período atual'
    }
  ];

  const camposData = [
    {
      name: 'dataFim',
      label: 'Nova Data de Fechamento',
      type: 'text' as const,
      help: 'Formato: YYYY-MM-DDThh:mm:ss (ex: 2025-05-26T11:00:00)'
    }
  ];

  const campos = modo === 'minutos' ? camposMinutos : camposData;

  return (
    <>
      <div className="modo-container">
        <h3>Escolha como deseja atualizar o período:</h3>
        <div className="modo-toggle" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="button"
            className={`botao-secundario ${modo === 'minutos' ? 'active' : ''}`}
            style={{
              backgroundColor: modo === 'minutos' ? 'var(--primary)' : '',
              color: modo === 'minutos' ? 'white' : '',
            }}
            onClick={() => setModo('minutos')}
          >
            Adicionar Minutos
          </button>
          <button
            type="button"
            className={`botao-secundario ${modo === 'data' ? 'active' : ''}`}
            style={{
              backgroundColor: modo === 'data' ? 'var(--primary)' : '',
              color: modo === 'data' ? 'white' : '',
            }}
            onClick={() => setModo('data')}
          >
            Nova Data de Fechamento
          </button>
        </div>
      </div>

      <GenericForm
        formData={formData}
        errors={errors}
        enviando={enviando}
        campos={campos}
        submitLabel={submitLabel}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AtualizarPeriodoSessaoForm;