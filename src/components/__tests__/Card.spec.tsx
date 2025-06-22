import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnIniciarSessao = jest.fn();
  const mockOnVotar = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o card com título e conteúdo', () => {
    const titulo = 'Título do Card';
    const content = 'Conteúdo de teste';
    
    render(
      <Card titulo={titulo}>
        <p>{content}</p>
      </Card>
    );
    
    expect(screen.getByText(titulo)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('deve renderizar o botão de editar e chamar a função quando clicado', () => {
    render(
      <Card titulo="Card Editável" onEdit={mockOnEdit}>
        Conteúdo
      </Card>
    );
    
    const editButton = screen.getByText('Editar');
    
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar o botão de excluir e chamar a função quando clicado', () => {
    render(
      <Card titulo="Card com Delete" onDelete={mockOnDelete}>
        Conteúdo
      </Card>
    );
    
    const deleteButton = screen.getByText('Excluir');
    
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar o botão de iniciar sessão e chamar a função quando clicado', () => {
    render(
      <Card titulo="Card com Iniciar Sessão" onIniciarSessao={mockOnIniciarSessao}>
        Conteúdo
      </Card>
    );
    
    const iniciarSessaoButton = screen.getByText('Iniciar Sessão');
    
    fireEvent.click(iniciarSessaoButton);
    
    expect(mockOnIniciarSessao).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar o botão de votar e chamar a função quando clicado', () => {
    render(
      <Card titulo="Card com Votar" onVotar={mockOnVotar}>
        Conteúdo
      </Card>
    );
    
    const votarButton = screen.getByText('Votar');
    
    fireEvent.click(votarButton);
    
    expect(mockOnVotar).toHaveBeenCalledTimes(1);
  });

  it('deve expandir/recolher quando clickToReveal é true e o card é clicado', () => {
    render(
      <Card titulo="Card Expandível" clickToReveal={true}>
        <p>Conteúdo que pode ser expandido</p>
      </Card>
    );
    
    expect(screen.getByText('Clique para expandir')).toBeInTheDocument();
    
    const card = screen.getByText('Card Expandível').closest('.card');
    if (card) {
      fireEvent.click(card);
    }
    
    expect(screen.getByText('Clique para recolher')).toBeInTheDocument();
    
    if (card) {
      fireEvent.click(card);
    }
    
    expect(screen.getByText('Clique para expandir')).toBeInTheDocument();
  });
  
  it('não deve renderizar ações quando não fornecidas', () => {
    render(
      <Card titulo="Card Simples">
        <p>Conteúdo simples</p>
      </Card>
    );
    
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
    expect(screen.queryByText('Iniciar Sessão')).not.toBeInTheDocument();
    expect(screen.queryByText('Votar')).not.toBeInTheDocument();
  });

  it('deve aplicar class name personalizada quando fornecida', () => {
    const customClass = 'custom-card-class';
    
    render(
      <Card titulo="Card com Classe Personalizada" className={customClass}>
        <p>Conteúdo</p>
      </Card>
    );
    
    const cardElement = screen.getByText('Card com Classe Personalizada').closest('.card');
    expect(cardElement).toHaveClass(customClass);
  });
});