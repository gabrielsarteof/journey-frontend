# Ícones do Projeto

Estrutura de ícones seguindo Clean Architecture e melhores práticas.

## 📁 Estrutura

```
src/shared/assets/icons/
├── navigation/          # Ícones da navegação (navbar/footer)
│   ├── home.svg
│   ├── target.svg
│   ├── flag.svg
│   ├── trophy.svg
│   ├── menu.svg
│   └── index.ts        # Barrel export
├── modules/            # Ícones dos módulos de aprendizado
│   ├── backend.svg
│   ├── frontend.svg
│   ├── devops.svg
│   ├── mobile.svg
│   ├── data.svg
│   ├── fullstack.svg
│   └── index.ts        # Barrel export
└── index.ts            # Barrel export principal
```

## 🏗️ Clean Architecture

Os ícones estão em `src/shared/assets/icons/` porque:

1. ✅ São **compartilhados** entre múltiplas features
2. ✅ Fazem parte da **infraestrutura compartilhada**
3. ✅ Seguem a **separação de camadas** do Clean Architecture
4. ✅ Mantêm **consistência** com a estrutura do projeto

## 🎨 Como Adicionar Novos Ícones

### 1. Baixar o SVG

Baixe o ícone de sites como:
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)
- [Material Icons](https://fonts.google.com/icons)
- [Lucide](https://lucide.dev/)

### 2. Preparar o SVG

O SVG deve ter `fill="currentColor"` para suportar tematização:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="..."/>
</svg>
```

### 3. Salvar no Diretório Correto

- **Navegação:** `src/shared/assets/icons/navigation/nome-do-icone.svg`
- **Módulos:** `src/shared/assets/icons/modules/nome-do-modulo.svg`

### 4. Adicionar ao Barrel Export

Adicione a exportação no `index.ts` correspondente:

```typescript
// navigation/index.ts
export { default as NovoIcon } from './novo-icone.svg?react'

// modules/index.ts
export { default as NovoModuloIcon } from './novo-modulo.svg?react'
```

## 🔧 Como Usar

### Import Organizado

```tsx
import { HomeIcon, TargetIcon } from '@/shared/assets/icons'
// ou
import { BackendIcon, FrontendIcon } from '@/shared/assets/icons'
```

### Uso no Componente

```tsx
<HomeIcon className="w-6 h-6 text-secondary" />
<BackendIcon className="w-8 h-8 text-primary" />
```

### Tematização Automática

As cores são controladas via CSS:

```tsx
// Light mode: cor definida pelo theme
<HomeIcon className="text-secondary" />

// Dark mode: cor ajusta automaticamente
<HomeIcon className="text-secondary" />

// Hover states
<HomeIcon className="text-secondary hover:text-primary" />
```

## ✅ Boas Práticas

1. ✅ **Use `currentColor`** - Permite tematização via CSS
2. ✅ **viewBox 0 0 24 24** - Mantém consistência de tamanho
3. ✅ **Nomes descritivos** - `home.svg`, `backend.svg`
4. ✅ **Lowercase com hífen** - `novo-icone.svg`
5. ✅ **Adicione ao barrel export** - Mantém imports organizados
6. ✅ **Remova atributos desnecessários** - width, height, style

## 🚫 O Que Evitar

- ❌ Cores hardcoded (`fill="#FF0000"`)
- ❌ Inline styles (`style="color: red"`)
- ❌ Width/height fixos no SVG
- ❌ IDs que podem conflitar
- ❌ Imports diretos sem barrel export

## 🔍 Troubleshooting

### Ícone não muda de cor

Verifique se o SVG tem `fill="currentColor"`:

```svg
<!-- ❌ Errado -->
<svg fill="#000000">...</svg>

<!-- ✅ Correto -->
<svg fill="currentColor">...</svg>
```

### Import não funciona

Certifique-se de usar `?react` ou importar do barrel export:

```tsx
// ❌ Errado
import HomeIcon from '@/shared/assets/icons/navigation/home.svg'

// ✅ Correto (direto)
import HomeIcon from '@/shared/assets/icons/navigation/home.svg?react'

// ✅ Melhor (barrel export)
import { HomeIcon } from '@/shared/assets/icons'
```

## 📦 Dependências

Este sistema utiliza:
- **vite-plugin-svgr**: Transforma SVGs em componentes React
- **Tailwind CSS**: Sistema de cores e tematização
- **TypeScript**: Type-safety nos imports

## 🏗️ Arquitetura

Esta estrutura segue princípios de Clean Architecture:

- **Separação de Responsabilidades**: Ícones organizados por domínio
- **Barrel Exports**: Abstração da implementação
- **Independência de Framework**: SVGs podem ser usados em qualquer contexto
- **Facilidade de Manutenção**: Adicionar/remover ícones é simples
- **Shared Layer**: Recursos compartilhados entre features
