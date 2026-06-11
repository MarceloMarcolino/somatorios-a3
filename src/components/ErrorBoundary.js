import React from 'react';

// ErrorBoundary (classe): captura erros de render da arvore abaixo dele e
// mostra um fallback amigavel em vez de tela branca. Precisa ser componente
// de classe: getDerivedStateFromError nao tem equivalente em hook.
export default class ErrorBoundary extends React.Component {
  state = { temErro: false };

  static getDerivedStateFromError() {
    return { temErro: true };
  }

  componentDidCatch(erro, info) {
    // diagnostico no console (vale tambem em producao); o MVP nao tem telemetria
    console.error('Erro capturado pelo ErrorBoundary:', erro, info);
  }

  render() {
    if (!this.state.temErro) return this.props.children;

    return (
      <main className="container py-5" role="alert">
        <div className="card card-ludico shadow-sm mx-auto text-center" style={{ maxWidth: 480 }}>
          <div className="card-body p-4">
            <i className="fas fa-triangle-exclamation fa-2x txt-aviso mb-3" aria-hidden="true"></i>
            <h1 className="h4">Ops! Algo deu errado.</h1>
            <p className="text-muted">
              Recarregue a página para voltar à tela inicial. As estatísticas das
              partidas continuam salvas.
            </p>
            <div className="d-grid mt-3">
              <button
                className="btn btn-primary btn-grande"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-rotate-right me-2" aria-hidden="true"></i>Recarregar
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
