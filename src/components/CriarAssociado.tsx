import AssociadoForm from './form/AssociadoForm';
import useFormAssociado from '../hooks/useFormAssociado';
import CriarEntidade from './generic/CriarEntidade';

function CriarAssociado() {
  const { formData, errors, enviando, enviado, handleChange, handleSubmit } = useFormAssociado();

  return (
    <div className="criar-associado">
      <CriarEntidade
        titulo="Criar Associado"
        formData={formData}
        errors={errors}
        enviando={enviando}
        enviado={enviado}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        FormComponent={AssociadoForm}
      />
    </div>
  );
}

export default CriarAssociado;