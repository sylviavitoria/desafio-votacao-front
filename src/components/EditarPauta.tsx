import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PautaForm from './form/PautaForm';
import usePautaDetalhes from '../hooks/usePautaDetalhes';
import useFormPauta from '../hooks/useFormPauta';

function EditarPauta() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
    onSuccess: () => {
      setTimeout(() => {
        navigate('/listar-pautas');
      }, 2000);
    }
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

  if (carregandoDetalhes) {
    return <p className="carregando">Carregando dados da pauta...</p>;
  }

  if (erroDetalhes) {
    return (
      <div className="editar-pauta">
        <h2>Erro ao Carregar Pauta</h2>
        <div className="error-message">{erroDetalhes}</div>
        <button 
          className="botao-secundario" 
          onClick={() => navigate('/listar-pautas')}
        >
          Voltar para listagem
        </button>
      </div>
    );
  }

  return (
    <div className="editar-pauta">
      <h2>Editar Pauta</h2>
      
      {enviado && (
        <div className="success-message">
          Pauta atualizada com sucesso!
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
        submitLabel={{ idle: 'Atualizar', enviando: 'Atualizando...' }}
        modoEdicao={true} 
      />

      <div className="botao-container" style={{ textAlign: 'center', padding: '1rem 0' }}>
        <button
          className="botao-secundario"
          onClick={() => navigate('/listar-pautas')}
          disabled={enviando}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default EditarPauta;
