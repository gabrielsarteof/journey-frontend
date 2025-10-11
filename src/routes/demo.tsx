import { createFileRoute } from '@tanstack/react-router'
import { useNotificationActions } from '../shared/contexts/NotificationContext'
import { useTheme } from '../shared/contexts/ThemeContext'

function DemoPage() {
  const { success, error, warning, info } = useNotificationActions()
  const { theme, resolvedTheme } = useTheme()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-journeyBlack dark:text-white mb-4">
          Demo Context API
        </h1>
        <p className="text-journeyGrayText dark:text-gray-300">
          Demonstração dos contextos implementados seguindo Clean Architecture
        </p>
      </div>

      {/* Theme Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          Theme Context
        </h2>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Tema selecionado:</strong> {theme}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Tema resolvido:</strong> {resolvedTheme}
          </p>
        </div>
      </div>

      {/* Notification Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          Notification Context
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => success('Sucesso!', 'Operação realizada com sucesso.')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Notificação de Sucesso
          </button>

          <button
            onClick={() => error('Erro!', 'Algo deu errado na operação.')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Notificação de Erro
          </button>

          <button
            onClick={() => warning('Atenção!', 'Esta ação pode ter consequências.')}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            Notificação de Aviso
          </button>

          <button
            onClick={() => info('Informação', 'Dados foram atualizados.')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Notificação de Info
          </button>
        </div>
      </div>

      {/* Architectural Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          Benefícios Arquiteturais
        </h2>
        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Type Safety:</strong> Contextos completamente tipados com TypeScript</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Error Boundaries:</strong> Falhas rápidas e recuperação graceful</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Strategy Pattern:</strong> Diferentes estratégias de storage para Theme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Queue Management:</strong> Sistema FIFO para notificações</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Composition:</strong> Providers compostos seguindo Single Responsibility</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span><strong>Domain Logic:</strong> Business rules encapsuladas em Value Objects</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})