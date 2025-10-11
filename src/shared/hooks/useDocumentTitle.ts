import { useEffect } from 'react'

/**
 * Hook para gerenciar o título da página de forma dinâmica
 * Padrão: "Journey" na landing page e "Nome da Página | Journey" nas demais
 */
export function useDocumentTitle(pageTitle?: string) {
  useEffect(() => {
    const previousTitle = document.title

    if (pageTitle) {
      document.title = `${pageTitle} | Journey`
    } else {
      document.title = 'Journey'
    }

    // Cleanup: restaura o título anterior quando o componente é desmontado
    return () => {
      document.title = previousTitle
    }
  }, [pageTitle])
}
