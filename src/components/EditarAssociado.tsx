import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AssociadoForm from './form/AssociadoForm';
import useAssociadoDetalhes from '../hooks/useAssociadoDetalhes';
import useFormAssociado from '../hooks/useFormAssociado';
import EditarEntidade from './generic/EditarEntidade';

interface AssociadoFormData {
  nome: string;
  cpf: string;
  email: string;
  id?: number;
}

function EditarAssociado() {
  const { id } = useParams<{ id: string }>();
  const associadoId = id ? parseInt(id) : undefined;

  const {
    associado,
    carregando: carregandoDetalhes,
    erro: erroDetalhes
  } = useAssociadoDetalhes({ id: associadoId });

  const {
    formData,
    errors,
    enviando,
    enviado,
    handleChange,
    handleSubmit,
    setFormData
  } = useFormAssociado({
    associadoId,
    onSuccess: () => { }
  });

  useEffect(() => {
    if (associado) {
      setFormData(associado);
    }
  }, [associado, setFormData]);

  return (
    <div className="editar-associado">
      <EditarEntidade<AssociadoFormData>
        titulo="Editar Associado"
        carregandoDetalhes={carregandoDetalhes}
        erroDetalhes={erroDetalhes}
        formData={formData as AssociadoFormData}
        errors={errors}
        enviando={enviando}
        enviado={enviado}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        rotaVoltar="listar-associados"
        FormComponent={AssociadoForm}
      />
    </div>
  );
}

export default EditarAssociado;