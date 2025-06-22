import { FormEvent } from 'react';
import { OpcaoVoto } from '../../types/Voto';

interface VotacaoFormProps {
  associadoId: number;
  pautaId: number;
  votando: boolean;
  erro: string | null;
  onVotar: (opcao: OpcaoVoto) => void;
}

const VotacaoForm = ({ 
  associadoId, 
  pautaId, 
  votando, 
  erro, 
  onVotar 
}: VotacaoFormProps) => {
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>, opcao: OpcaoVoto) => {
    e.preventDefault();
    onVotar(opcao);
  };

  return (
    <div className="votacao-form card">
      <div className="card-titulo">Registrar seu voto</div>
      
      <div className="card-conteudo">
        {erro && (
          <div className="error-message">
            {erro}
          </div>
        )}
        
        <p>ID do Associado: <strong>{associadoId}</strong></p>
        <p>ID da Pauta: <strong>{pautaId}</strong></p>
        
        <div className="voto-opcoes" style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'center' }}>
          <form onSubmit={(e) => handleSubmit(e, OpcaoVoto.SIM)} style={{ flex: 1 }}>
            <button 
              type="submit" 
              className="botao-principal" 
              style={{ backgroundColor: '#1bc47d', width: '100%' }}
              disabled={votando}
            >
              {votando ? "Votando..." : "SIM"}
            </button>
          </form>
          
          <form onSubmit={(e) => handleSubmit(e, OpcaoVoto.NAO)} style={{ flex: 1 }}>
            <button 
              type="submit" 
              className="botao-principal" 
              style={{ backgroundColor: '#e74c3c', width: '100%' }}
              disabled={votando}
            >
              {votando ? "Votando..." : "NÃO"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VotacaoForm;