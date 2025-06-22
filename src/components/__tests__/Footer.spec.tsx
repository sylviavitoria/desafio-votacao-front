import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('deve renderizar o rodapé com o texto de copyright', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© Criado por Sylvia/)).toBeInTheDocument();
  });

  it('deve renderizar com o texto de crédito', () => {
    render(<Footer />);
    
    const footerText = screen.getByText(/© Criado por Sylvia/);
    expect(footerText).toBeInTheDocument();
  });

  it('deve renderizar com a tag footer', () => {
    render(<Footer />);
    
    const footerElement = screen.getByText(/© Criado por Sylvia/).closest('footer');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass('footer');
  });
});