import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Associado from './pages/Associado';
import EditarAssociado from './components/EditarAssociado';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/associado" element={<Associado />} />
          <Route path="/editar-associado/:id" element={<EditarAssociado />} />
          <Route path="/listar-associados" element={<Associado />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;