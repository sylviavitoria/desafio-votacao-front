import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssociadoForm from './form/AssociadoForm';
import useAssociadoDetalhes from '../hooks/useAssociadoDetalhes';
import useFormAssociado from '../hooks/useFormAssociado';

function EditarAssociado() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
    onSuccess: () => {
      setTimeout(() => {
        navigate('/listar-associados');
      }, 2000);
    }
  });

  useEffect(() => {
    if (associado) {
      setFormData(associado);
    }
  }, [associado, setFormData]);

  if (carregandoDetalhes) {
    return <p className="carregando">Carregando dados do associado...</p>;
  }

  if (erroDetalhes) {
    return (
      <div className="editar-associado content">
        <h2>Erro ao Carregar Associado</h2>
        <div className="error-message">{erroDetalhes}</div>
        <button 
          className="botao-secundario" 
          onClick={() => navigate('/listar-associados')}
        >
          Voltar para listagem
        </button>
      </div>
    );
  }

  return (
    <div className="editar-associado">
      <h2>Editar Associado</h2>
      
      {enviado && (
        <div className="success-message">
          Associado atualizado com sucesso!
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
        submitLabel={{ idle: 'Atualizar', enviando: 'Atualizando...' }}
      />

      <div className="botao-container" style={{ textAlign: 'center', padding: '1rem 0' }}>
        <button
          className="botao-secundario"
          onClick={() => navigate('/listar-associados')}
          disabled={enviando}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default EditarAssociado;

//modificou