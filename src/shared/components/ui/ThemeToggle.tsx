import { useTheme } from '../../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border-light text-primary transition-all duration-200"
        title={`Tema atual: ${resolvedTheme === 'dark' ? 'escuro' : 'claro'}`}
        aria-label={`Alternar tema. Tema atual: ${resolvedTheme === 'dark' ? 'escuro' : 'claro'}`}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="text-sm bg-surface text-primary border border-border-light rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer hover:bg-surface-elevated"
        aria-label="Selecionar modo de tema"
      >
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
        <option value="system">Sistema</option>
      </select>
    </div>
  )
}