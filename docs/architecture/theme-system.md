# Theme System Architecture - Tailwind CSS v4

## Overview

Sistema de temas implementado seguindo as melhores práticas do Tailwind CSS v4, com suporte a light/dark/system modes, transições suaves e acessibilidade completa.

---

## Implementation Details

### 1. CSS Custom Variant (Tailwind v4)

**File:** `src/globals.css`

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

Permite usar classes `dark:` do Tailwind com `data-theme` attribute ao invés de classes CSS tradicionais.

**Benefits:**
- CSS-first approach (Tailwind v4 native)
- Better semantics: `data-theme="dark"` vs `class="dark"`
- No class conflicts
- Better DevTools debugging

---

### 2. CSS @property for Smooth Transitions

**File:** `src/globals.css`

```css
@property --color-background {
  syntax: '<color>';
  inherits: true;
  initial-value: #fafafa;
}

html {
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
              color 0.2s cubic-bezier(0.2, 0, 0, 1);
}
```

**Technical details:**
- CSS Houdini `@property` provides type-safety for custom properties
- Enables smooth animations between theme values
- Uses `--ease-snappy` timing function for perceived performance

---

### 3. Anti-FOUC Blocking Script

**File:** `index.html`

```javascript
// Executes before first paint to prevent Flash of Unstyled Content
(function() {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme; // Browser hint
})();
```

**Critical path optimization:**
- Synchronous execution before React hydration
- Reads from localStorage before DOM manipulation
- Sets both `data-theme` attribute and `colorScheme` style
- Zero-flash experience on initial load

**colorScheme hint:**
- Instructs browser to render native scrollbars in correct theme
- Affects form controls (`<input>`, `<select>`) appearance
- Impacts browser-provided UI (popups, tooltips)

---

### 4. Theme Context Migration

**File:** `src/shared/contexts/ThemeContext.tsx`

#### Before (v3 style):
```typescript
document.documentElement.classList.add('dark')
```

#### After (v4 native):
```typescript
document.documentElement.setAttribute('data-theme', newTheme.resolved)
document.documentElement.style.colorScheme = newTheme.resolved
```

**Architectural patterns preserved:**
- **Value Object**: `Theme` class encapsulates resolution logic
- **Strategy Pattern**: `ThemeStorageStrategy` interface (LocalStorage, Memory, Cached)
- **Observer Pattern**: `matchMedia` listener for system preference changes
- **Command Pattern**: `handleSetTheme` encapsulates mutation logic

---

### 5. Accessibility Implementation

**File:** `src/shared/contexts/ThemeContext.tsx`

```typescript
// ARIA live region announces theme changes to screen readers
const announcement = document.createElement('div')
announcement.setAttribute('role', 'status')
announcement.setAttribute('aria-live', 'polite')
announcement.setAttribute('aria-atomic', 'true')
announcement.className = 'sr-only'
announcement.textContent = `Tema alterado para modo ${theme}`
```

**WCAG 2.1 compliance:**
- `role="status"`: Identifies content as status message
- `aria-live="polite"`: Announces at next graceful opportunity (not interrupting)
- `aria-atomic="true"`: Announces entire region content
- `.sr-only`: Visually hidden but accessible to assistive technology

**Utility class added:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  clip: rect(0, 0, 0, 0); /* Clip-path alternative for older browsers */
  /* ... */
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interaction                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     ThemeContext (React)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Command: handleSetTheme(theme)                       │  │
│  │    ├─> Theme.resolve(theme) [Value Object]           │  │
│  │    ├─> DOM manipulation (data-theme + colorScheme)   │  │
│  │    └─> StorageStrategy.set(theme) [Strategy Pattern] │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│   Storage Layer      │        │    DOM/CSS Layer     │
│                      │        │                      │
│  ┌────────────────┐  │        │  ┌────────────────┐  │
│  │ LocalStorage   │  │        │  │ data-theme=""  │  │
│  │ MemoryCache    │  │        │  │ colorScheme    │  │
│  │ CachedStrategy │  │        │  │ @custom-variant│  │
│  └────────────────┘  │        │  └────────────────┘  │
└──────────────────────┘        └──────────────────────┘
           │                               │
           └───────────────┬───────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  Tailwind CSS v4     │
                │  dark: variant       │
                │  (auto-applied)      │
                └──────────────────────┘
```

---

## Performance Considerations

### 1. Paint Performance
- `@property` enables GPU-accelerated transitions
- `cubic-bezier(0.2, 0, 0, 1)` provides snappy feel without jank
- `transition` limited to `background-color` and `color` only (avoid layout thrashing)

### 2. Memory Efficiency
- Single theme state in Context (no Redux overhead)
- Strategy pattern allows memory-only storage for tests
- localStorage access optimized (sync reads, minimal writes)

### 3. Bundle Size
- Zero JavaScript theme library dependencies
- CSS-only theme switching after initial load
- Tailwind v4 tree-shaking removes unused variants

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| `@property` | 85+ | 128+ | 16.4+ | 85+ |
| `@custom-variant` | N/A (PostCSS) | N/A | N/A | N/A |
| `data-theme` | All | All | All | All |
| `colorScheme` | 81+ | 96+ | 13+ | 81+ |
| `matchMedia` | 10+ | 6+ | 5.1+ | 12+ |

**Graceful degradation:**
- Without `@property`: themes work, no smooth transitions
- Without `colorScheme`: themes work, native controls use default appearance

---

## Testing Strategy

### Manual Testing
1. Toggle between light/dark/system modes
2. Verify no FOUC on page reload
3. Check system preference changes are detected
4. Validate localStorage persistence
5. Test screen reader announcements

### Automated Testing (TODO)
```typescript
describe('ThemeContext', () => {
  it('should apply data-theme attribute', () => {
    // Test DOM manipulation
  })

  it('should persist theme to storage', () => {
    // Test StorageStrategy
  })

  it('should respect system preferences', () => {
    // Test matchMedia integration
  })
})
```

---

## Migration Guide (v3 → v4)

### No Breaking Changes
All existing components using `dark:` classes continue to work without modification:

```tsx
// This works automatically
<button className="bg-white dark:bg-gray-800">
  Button
</button>
```

The `@custom-variant` configuration maps `dark:` to `[data-theme="dark"]` transparently.

---

## Future Enhancements

### 1. OKLCH Color Space
Tailwind v4 recommends OKLCH for perceptually uniform colors:

```css
/* Current (hex) */
--color-primary: #0f0f0f;

/* Enhanced (OKLCH) */
--color-primary: oklch(0.06 0 0);
```

### 2. Dynamic theme-color Meta Tag
```html
<meta name="theme-color"
      content="#fafafa"
      media="(prefers-color-scheme: light)">
<meta name="theme-color"
      content="#141f24"
      media="(prefers-color-scheme: dark)">
```

### 3. useMediaQuery Hook
```typescript
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  )
  // Implementation...
}
```

---

## References

- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS @property Specification](https://drafts.css-houdini.org/css-properties-values-api/)
- [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [prefers-color-scheme MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

## Modified Files

```
journey-frontend/
├── index.html                              # Anti-FOUC script
├── src/
│   ├── globals.css                         # @custom-variant, @property, transitions
│   └── shared/
│       └── contexts/
│           └── ThemeContext.tsx            # data-theme + a11y
```

**Zero breaking changes** - Full backward compatibility maintained.
