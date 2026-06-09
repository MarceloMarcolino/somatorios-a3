import React, { useMemo } from 'react';

// Confete de vitória (Passo 11) - CSS puro, sem dependências.
// Decorativo (aria-hidden). Só é renderizado quando o usuário NÃO pede menos
// movimento (a checagem fica em TelaFim); e o @media prefers-reduced-motion
// zera as animações como segunda barreira.
const CORES = ['#1457a8', '#1b7f3b', '#c62828', '#6a1b9a', '#ff7a00', '#f4c20d'];

export default function Confete({ quantidade = 28 }) {
  const pecas = useMemo(
    () =>
      Array.from({ length: quantidade }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duracao: 2.4 + Math.random() * 1.6,
        giro: 180 + Math.random() * 540,
        cor: CORES[i % CORES.length],
      })),
    [quantidade]
  );

  return (
    <div className="confete" aria-hidden="true">
      {pecas.map((p) => (
        <span
          key={p.id}
          className="confete__peca"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.cor,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duracao}s`,
            '--giro': `${p.giro}deg`,
          }}
        />
      ))}
    </div>
  );
}
