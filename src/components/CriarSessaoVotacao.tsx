import SessaoVotacaoForm from './form/SessaoVotacaoForm';
import useFormSessaoVotacao from '../hooks/useFormSessaoVotacao';
import CriarEntidade from './generic/CriarEntidade';

interface CriarSessaoVotacaoProps {
  pautaId?: number;
  onSuccess?: () => void;
}

function CriarSessaoVotacao({ pautaId, onSuccess }: CriarSessaoVotacaoProps) {
  const { 
    formData, 
    errors, 
    enviando, 
    enviado, 
    handleChange, 
    handleSubmit,
    modo,
    setModo
  } = useFormSessaoVotacao({ 
    pautaId,
    onSuccess: (data) => {
      console.log('Sessão de votação criada com sucesso', data);
      if (onSuccess) onSuccess();
    }
  });

  return (
    <div className="criar-sessao">
      <CriarEntidade
        titulo="Iniciar Sessão de Votação"
        formData={formData}
        errors={errors}
        enviando={enviando}
        enviado={enviado}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        FormComponent={SessaoVotacaoForm}
        formProps={{ modo, setModo }}
      />
    </div>
  );
}

export default CriarSessaoVotacao;