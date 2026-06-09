import { useEffect, useRef } from 'react';

// Acessibilidade de diálogos/overlays (Passo 7):
//  - move o foco para dentro do diálogo ao abrir;
//  - prende o foco (focus trap) com Tab/Shift+Tab;
//  - fecha com Esc quando onFechar é fornecido;
//  - devolve o foco ao elemento que abriu o diálogo ao fechar.
// Retorna um ref que deve ser anexado ao container do diálogo.
const SELETOR_FOCAVEL =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useDialogoAcessivel(onFechar) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    const elementoAnterior = document.activeElement;

    // foca o primeiro elemento focável (ou o próprio container como fallback)
    const focaveis = container ? container.querySelectorAll(SELETOR_FOCAVEL) : [];
    if (focaveis.length > 0) {
      focaveis[0].focus();
    } else if (container) {
      container.focus();
    }

    const aoTeclar = (e) => {
      if (e.key === 'Escape' && onFechar) {
        e.preventDefault();
        onFechar();
        return;
      }
      if (e.key === 'Tab' && container) {
        const lista = container.querySelectorAll(SELETOR_FOCAVEL);
        if (lista.length === 0) {
          e.preventDefault();
          return;
        }
        const primeiro = lista[0];
        const ultimo = lista[lista.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };

    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      if (elementoAnterior && typeof elementoAnterior.focus === 'function') {
        elementoAnterior.focus();
      }
    };
  }, [onFechar]);

  return ref;
}
