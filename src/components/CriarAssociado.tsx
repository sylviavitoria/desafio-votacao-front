import AssociadoForm from './form/AssociadoForm';
import useFormAssociado from '../hooks/useFormAssociado';

function CriarAssociado() {
  const { formData, errors, enviando, enviado, handleChange, handleSubmit } = useFormAssociado();

  return (
    <div className="criar-associado">
      <h1>Criar Associado</h1>
      
      {enviado && (
        <div className="success-message">
          Associado criado com sucesso!
        </div>
      )}

      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      <AssociadoForm 
        formData={formData}
        errors={errors}
        enviando={enviando}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default CriarAssociado;