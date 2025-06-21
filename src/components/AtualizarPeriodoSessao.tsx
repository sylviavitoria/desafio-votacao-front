import useFormAtualizarPeriodoSessao from '../hooks/useFormAtualizarPeriodoSessao';
import AtualizarPeriodoSessaoForm from './form/AtualizarPeriodoSessaoForm';
import CriarEntidade from './generic/CriarEntidade';

interface AtualizarPeriodoSessaoProps {
  sessaoId: number;
  onSuccess?: () => void;
}

function AtualizarPeriodoSessao({ sessaoId, onSuccess }: AtualizarPeriodoSessaoProps) {
  const {
    formData,
    errors,
    enviando,
    enviado,
    erro,
    handleChange,
    handleSubmit,
    modo,
    setModo
  } = useFormAtualizarPeriodoSessao({
    sessaoId,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    }
  });

  return (
    <div className="atualizar-periodo-sessao">
      <CriarEntidade
        titulo="Atualizar Período da Sessão"
        formData={formData}
        errors={{ ...errors, form: erro }}
        enviando={enviando}
        enviado={enviado}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        FormComponent={AtualizarPeriodoSessaoForm}
        formProps={{ modo, setModo }}
      />
    </div>
  );
}

export default AtualizarPeriodoSessao;