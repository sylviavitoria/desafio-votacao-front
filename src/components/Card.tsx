import { ReactNode, useState } from 'react';

interface CardProps {
  titulo?: string;
  children: ReactNode;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  actions?: ReactNode;
  clickToReveal?: boolean; 
}

const Card = ({ 
  titulo, 
  children, 
  className = '', 
  onEdit, 
  onDelete, 
  actions, 
  clickToReveal = false 
}: CardProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (clickToReveal) {
      setExpanded(!expanded);
    }
  };

  const showActions = !clickToReveal || (clickToReveal && expanded);

  return (
    <div 
      className={`card ${className} ${clickToReveal ? 'card-clickable' : ''} ${expanded ? 'card-expanded' : ''}`} 
      onClick={handleClick}
    >
      {titulo && <h3 className="card-titulo">{titulo}</h3>}
      
      <div className="card-conteudo">
        {children}
      </div>
      
      {(onEdit || onDelete || actions) && showActions && (
        <div className="card-acoes" onClick={e => e.stopPropagation()}>
          {actions}
          
          {onEdit && (
            <button 
              className="botao-secundario"
              onClick={onEdit}
            >
              Editar
            </button>
          )}
          
          {onDelete && (
            <button 
              className="botao-secundario excluir"
              onClick={onDelete}
            >
              Excluir
            </button>
          )}
        </div>
      )}
      
      {clickToReveal && (
        <div className="card-expand-hint">
          {expanded ? 'Clique para recolher' : 'Clique para expandir'}
        </div>
      )}
    </div>
  );
};

export default Card;