import React from 'react';
import { createRoot } from 'react-dom/client';

// CSS do Bootstrap 5 (design responsivo - requisito do enunciado) + estilos proprios.
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Ponto de entrada (React 19): monta o componente App na div #root do index.html.
// ErrorBoundary no topo: qualquer erro de render vira fallback amigavel
// em vez de tela branca (importante para a demo ao vivo).
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
