import PautaForm from './form/PautaForm';
import useFormPauta from '../hooks/useFormPauta';

function CriarPauta() {
  const { formData, errors, enviando, enviado, handleChange, handleSubmit } = useFormPauta();

  return (
    <div className="criar-pauta">
      <h1>Criar Pauta</h1>
      
      {enviado && (
        <div className="success-message">
          Pauta criada com sucesso!
        </div>
      )}

      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      <PautaForm 
        formData={formData}
        errors={errors}
        enviando={enviando}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default CriarPauta;