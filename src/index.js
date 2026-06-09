import React from 'react';
import { createRoot } from 'react-dom/client';

// CSS do Bootstrap 5 (design responsivo - requisito do enunciado) + estilos proprios.
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';

// Ponto de entrada (React 19): monta o componente App na div #root do index.html.
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
