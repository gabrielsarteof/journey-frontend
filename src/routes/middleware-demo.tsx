import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MiddlewareHttpClient } from '../shared/http/MiddlewareHttpClient'
import { AuthMiddleware, MiddlewarePhase } from '../shared/middleware'
import { useNotificationActions } from '../shared/contexts/NotificationContext'

function MiddlewareDemoPage() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { success, error: showError } = useNotificationActions()

  const httpClient = new MiddlewareHttpClient({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    enableLogging: true,
    enableRetry: true,
    retryOptions: {
      maxAttempts: 3,
      baseDelay: 1000
    }
  })

  httpClient.addMiddleware(
    new AuthMiddleware({
      tokenGetter: () => 'demo-token-123'
    }),
    MiddlewarePhase.REQUEST
  )

  const handleTestRequest = async (endpoint: string, method: 'GET' | 'POST' = 'GET') => {
    setLoading(true)
    setResponse(null)

    try {
      let result
      if (method === 'GET') {
        result = await httpClient.get(endpoint)
      } else {
        result = await httpClient.post(endpoint, {
          title: 'Teste via Middleware',
          body: 'Conteúdo de teste',
          userId: 1
        })
      }

      setResponse(result)
      success('Sucesso!', 'Requisição processada com middleware')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setResponse({ error: errorMessage })
      showError('Erro na requisição', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-journeyBlack dark:text-white mb-4">
          Middleware System Demo
        </h1>
        <p className="text-journeyGrayText dark:text-gray-300">
          Demonstração do sistema de middleware com Chain of Responsibility pattern
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          Middleware Chain Configurado
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span><strong>RequestInterceptor:</strong> Base URL + Headers padrão</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span><strong>AuthMiddleware:</strong> Token de autenticação automático</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span><strong>LoggingMiddleware:</strong> Log completo de requests/responses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span><strong>RetryMiddleware:</strong> Retry automático com exponential backoff</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          Teste o Sistema
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleTestRequest('/posts/1')}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            GET /posts/1
          </button>

          <button
            onClick={() => handleTestRequest('/posts', 'POST')}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            POST /posts
          </button>

          <button
            onClick={() => handleTestRequest('/invalid-endpoint')}
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
          >
            Teste 404 (com retry)
          </button>

          <button
            onClick={() => handleTestRequest('/timeout-test')}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            Teste Timeout
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Processando requisição através do middleware chain...
          </div>
        )}

        {response && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2 text-journeyBlack dark:text-white">
              Resultado:
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto max-h-96 text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          Benefícios Arquiteturais
        </h2>
        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Chain of Responsibility:</strong> Processamento sequencial e modular</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Strategy Pattern:</strong> Diferentes fases de execução (Request/Response/Error)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Open/Closed Principle:</strong> Extensível via novos middlewares</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Single Responsibility:</strong> Cada middleware tem função específica</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Configurabilidade:</strong> Sistema altamente configurável</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Observabilidade:</strong> Logging automático e estruturado</span>
          </li>
        </ul>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Abra o DevTools Console para ver os logs detalhados do middleware
      </div>
    </div>
  )
}

export const Route = createFileRoute('/middleware-demo')({
  component: MiddlewareDemoPage,
})