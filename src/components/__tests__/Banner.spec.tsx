import { render, screen } from '@testing-library/react';
import Banner from '../Banner';

describe('Banner', () => {
  const defaultProps = {
    titulo: 'Título do Banner',
    descricao: 'Descrição do banner para teste'
  };

  it('deve renderizar com o título e descrição fornecidos', () => {
    render(<Banner {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.titulo)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.descricao)).toBeInTheDocument();
  });

  it('deve renderizar com as classes corretas', () => {
    render(<Banner {...defaultProps} />);
    
    const bannerElement = screen.getByRole('heading', { name: defaultProps.titulo }).closest('.featured-image');
    expect(bannerElement).toBeInTheDocument();
    
    const imageContainer = bannerElement?.querySelector('.image-container');
    expect(imageContainer).toBeInTheDocument();
    
    const imageText = bannerElement?.querySelector('.image-text');
    expect(imageText).toBeInTheDocument();
  });

  it('deve aplicar estilos de formatação ao título', () => {
    render(<Banner {...defaultProps} />);
    
    const heading = screen.getByRole('heading', { name: defaultProps.titulo });
    expect(heading.tagName).toBe('H2');
  });
});