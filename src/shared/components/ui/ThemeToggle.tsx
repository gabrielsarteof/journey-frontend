import { useTheme } from '../../contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title={`Tema atual: ${resolvedTheme === 'dark' ? 'escuro' : 'claro'}`}
      >
        {resolvedTheme === 'dark' ? '🌞' : '🌙'}
      </button>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
      >
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
        <option value="system">Sistema</option>
      </select>
    </div>
  )
}