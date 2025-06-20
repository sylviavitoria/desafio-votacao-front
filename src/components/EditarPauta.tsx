import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PautaForm from './form/PautaForm';
import usePautaDetalhes from '../hooks/usePautaDetalhes';
import useFormPauta from '../hooks/useFormPauta';
import EditarEntidade from './generic/EditarEntidade';

interface PautaFormData {
  titulo: string;
  descricao: string;
  criadorId: number | string;
  id?: number;
}

function EditarPauta() {
  const { id } = useParams<{ id: string }>();
  const pautaId = id ? parseInt(id) : undefined;

  const {
    pauta,
    carregando: carregandoDetalhes,
    erro: erroDetalhes
  } = usePautaDetalhes({ id: pautaId });

  const {
    formData,
    errors,
    enviando,
    enviado,
    handleChange,
    handleSubmit,
    setFormData
  } = useFormPauta({
    pautaId,
    onSuccess: () => { }
  });

  useEffect(() => {
    if (pauta) {
      setFormData({
        titulo: pauta.titulo,
        descricao: pauta.descricao,
        criadorId: pauta.criador.id,
        id: pauta.id
      });
    }
  }, [pauta, setFormData]);

  return (
    <div className="editar-pauta">
      <EditarEntidade<PautaFormData>
        titulo="Editar Pauta"
        carregandoDetalhes={carregandoDetalhes}
        erroDetalhes={erroDetalhes}
        formData={formData as PautaFormData}
        errors={errors}
        enviando={enviando}
        enviado={enviado}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        rotaVoltar="listar-pautas"
        FormComponent={PautaForm}
        formProps={{ modoEdicao: true }}
      />
    </div>
  );
}

export default EditarPauta;