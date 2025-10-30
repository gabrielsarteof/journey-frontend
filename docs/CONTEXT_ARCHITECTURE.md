# Context API Architecture

## Visão Geral

Implementação robusta de Context API seguindo princípios de Clean Architecture, SOLID e Domain-Driven Design (DDD).

## Estrutura Arquitetural

```
src/shared/
├── abstractions/
│   └── BaseContext.ts           # Factory pattern + Type safety
├── contexts/
│   ├── ThemeContext.tsx         # Theme management com Strategy pattern
│   ├── NotificationContext.tsx  # Queue-based notifications
│   └── index.ts                 # Barrel exports
├── domain/
│   ├── entities/
│   │   └── Notification.ts      # Domain entity com business rules
│   ├── services/
│   │   └── NotificationQueue.ts # Domain service com Strategy pattern
│   └── value-objects/
│       └── Theme.ts             # Value object imutável
├── infrastructure/
│   └── storage/
│       └── ThemeStorage.ts      # Strategy implementations
└── components/
    ├── ErrorBoundary.tsx        # Error handling com logging
    └── ui/
        ├── NotificationContainer.tsx
        └── ThemeToggle.tsx
```

## Padrões Implementados

### 1. Factory Pattern
```typescript
// BaseContext.ts
export function createSafeContext<T extends BaseContextValue>(
  contextName: string
): [Context<T | null>, () => T]
```

**Benefícios:**
- Type safety garantido em compile time
- Fail-fast em caso de uso incorreto
- Padronização na criação de contextos

### 2. Strategy Pattern
```typescript
// ThemeStorage.ts
export interface ThemeStorageStrategy {
  get(): ThemeMode | null
  set(theme: ThemeMode): void
  remove(): void
}
```

**Implementações:**
- `LocalStorageThemeStrategy`: Persistência em localStorage
- `MemoryThemeStrategy`: Storage em memória (fallback)

### 3. Observer Pattern
```typescript
// ThemeContext.tsx - Sistema escuta mudanças do sistema
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => setCurrentTheme(Theme.resolve('system'))

  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}, [currentTheme.value])
```

### 4. Queue Pattern (FIFO)
```typescript
// NotificationQueue.ts
export class FIFONotificationQueue implements NotificationQueueStrategy {
  add(notification: Notification): void {
    if (this.notifications.length >= this.maxSize) {
      this.notifications.shift() // Remove oldest
    }
    this.notifications.push(notification)
  }
}
```

## Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada contexto tem uma responsabilidade única
- Providers separados para diferentes concerns
- Services específicos para lógica de domínio

### Open/Closed Principle (OCP)
- Estratégias de storage extensíveis via interface
- Notification queue strategies podem ser trocadas

### Liskov Substitution Principle (LSP)
- Qualquer implementação de `ThemeStorageStrategy` pode ser usada
- `NotificationQueueStrategy` implementations são intercambiáveis

### Interface Segregation Principle (ISP)
- Interfaces específicas e focadas
- Consumers só dependem do que precisam

### Dependency Inversion Principle (DIP)
- Contexts dependem de abstrações, não implementações
- Strategies são injetadas via props

## Domain-Driven Design

### Value Objects
```typescript
// Theme.ts
export class Theme {
  constructor(
    private readonly mode: ThemeMode,
    private readonly resolvedTheme: ResolvedTheme
  ) {}

  // Business logic encapsulada
  static resolve(mode: ThemeMode): Theme {
    const resolvedTheme = mode === 'system'
      ? Theme.getSystemTheme()
      : mode as ResolvedTheme
    return new Theme(mode, resolvedTheme)
  }
}
```

### Entities
```typescript
// Notification.ts
export class Notification {
  // Business rules: diferentes tipos têm durações padrão diferentes
  private getDefaultDuration(type: NotificationType): number {
    const durations: Record<NotificationType, number> = {
      success: 4000,
      error: 8000 // Erros ficam mais tempo visíveis
    }
    return durations[type]
  }
}
```

## Error Handling

### Error Boundaries
- **Critical level**: Erros na raiz da aplicação
- **Page level**: Erros em páginas específicas
- **Component level**: Erros em componentes isolados

### Custom Error Types
```typescript
export class ContextNotFoundError extends Error {
  constructor(contextName: string) {
    super(`${contextName} must be used within its provider`)
    this.name = 'ContextNotFoundError'
  }
}
```

## Performance Considerations

### React Query Integration
- Cache inteligente com stale time configurado
- Retry strategies diferenciadas por tipo de erro
- DevTools apenas em desenvolvimento

### Memoization
- Callbacks memoizados com `useCallback`
- Estratégias de storage como singletons
- Defensive copying em getters

### Memory Management
- Auto-cleanup de notificações expiradas
- Cleanup hooks para providers
- Weak references onde aplicável

## Uso

### Basic Usage
```typescript
// Em qualquer componente
function MyComponent() {
  const { theme, setTheme } = useTheme()
  const { success, error } = useNotificationActions()

  const handleAction = () => {
    try {
      // ... lógica
      success('Sucesso!', 'Operação concluída')
    } catch (err) {
      error('Erro!', 'Algo deu errado')
    }
  }
}
```

### Advanced Usage
```typescript
// Com estratégia customizada
function App() {
  const customStorage = new MemoryThemeStrategy()

  return (
    <ThemeProvider storageStrategy={customStorage}>
      <MyApp />
    </ThemeProvider>
  )
}
```

## Benefícios da Implementação

1. **Type Safety**: 100% tipado com TypeScript
2. **Extensibilidade**: Fácil adição de novas funcionalidades
3. **Testabilidade**: Cada parte pode ser testada isoladamente
4. **Performance**: Otimizações aplicadas em pontos críticos
5. **Maintainability**: Código limpo seguindo padrões estabelecidos
6. **Error Resilience**: Sistema robusto de tratamento de erros

## Demonstração de Conhecimento Técnico

Esta implementação demonstra:

- **Clean Architecture**: Separação clara entre domínio, aplicação e infraestrutura
- **Design Patterns**: Factory, Strategy, Observer, Queue
- **SOLID Principles**: Aplicados em todas as camadas
- **DDD**: Value Objects, Entities, Domain Services
- **Error Handling**: Boundaries, custom errors, graceful degradation
- **Performance**: Memoization, lazy loading, efficient re-renders
- **TypeScript Avançado**: Generics, type guards, conditional types