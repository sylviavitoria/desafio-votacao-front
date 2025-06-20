import PautaForm from './form/PautaForm';
import useFormPauta from '../hooks/useFormPauta';
import CriarEntidade from './generic/CriarEntidade';

interface PautaFormData {
  titulo: string;
  descricao: string;
  criadorId: number | string;
  id?: number;
}

function CriarPauta() {
  const { formData, errors, enviando, enviado, handleChange, handleSubmit } = useFormPauta();

  return (
    <div className="criar-pauta">
      <CriarEntidade<PautaFormData>
        titulo="Criar Pauta"
        formData={formData as PautaFormData}
        errors={errors}
        enviando={enviando}
        enviado={enviado}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        FormComponent={PautaForm}
      />
    </div>
  );
}

export default CriarPauta;