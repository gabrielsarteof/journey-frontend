# Navigation Icons

## 📋 Ícones Necessários

Esta pasta contém os ícones SVG usados na navegação principal da plataforma.

### ✅ Ícones Existentes

- `home.svg` - Página APRENDER
- `trophy.svg` - Página RANKINGS
- `user.svg` - Página PERFIL
- `target.svg` - (não usado atualmente)
- `flag.svg` - (não usado atualmente)
- `menu.svg` - (não usado atualmente)
- `flame.svg` - Streak indicator
- `gem.svg` - (decorativo)
- `heart.svg` - (decorativo)
- `lock.svg` - Estados bloqueados

### ⚠️ Ícones FALTANTES (Adicionar)

Para completar a nova navegação, você precisa adicionar:

1. **`chart.svg`** - Ícone para página PROGRESSO
   - Sugestão: Gráfico de linhas, trending up, ou analytics
   - Usado em: `/progress`

2. **`users.svg`** - Ícone para página EQUIPE
   - Sugestão: Grupo de pessoas, team, ou multiple users
   - Usado em: `/team`

## 🎨 Especificações dos Ícones

Ao adicionar novos ícones SVG, siga estas especificações:

### Tamanho
- ViewBox: `0 0 24 24` (preferencialmente)
- Dimensões reais não importam (SVG é vetorial)

### Estilo
- Stroke width: `2` ou `1.5` (consistente com ícones existentes)
- Fill: `currentColor` (para suportar temas claro/escuro)
- Estilo: Line icons (outline), não filled

### Formato
```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- Paths aqui -->
</svg>
```

## 📦 Fontes de Ícones

Recomendações de onde encontrar ícones no estilo correto:

1. **Lucide Icons** (Recomendado)
   - https://lucide.dev
   - Procure por: `trending-up`, `users`
   - Já no estilo correto!

2. **Heroicons**
   - https://heroicons.com
   - Outline style

3. **Feather Icons**
   - https://feathericons.com

## 🔧 Como Adicionar um Novo Ícone

1. Baixe o ícone SVG
2. Salve na pasta `journey-frontend/src/shared/assets/icons/navigation/`
3. Nomeie seguindo o padrão: `nome-do-icone.svg` (kebab-case)
4. O export já está configurado em `index.ts`
5. O ícone estará disponível automaticamente

## ✅ Checklist de Validação

Antes de usar um ícone, verifique:

- [ ] ViewBox é `0 0 24 24`
- [ ] Fill está como `none` ou `currentColor`
- [ ] Stroke está como `currentColor`
- [ ] Não tem cores hardcoded (#000, #fff, etc)
- [ ] Não tem classes CSS inline
- [ ] Não tem IDs (conflitos no DOM)

## 📝 Exemplo de Uso

```tsx
import { ChartIcon, UsersIcon } from '@/shared/assets/icons'

// Desktop
<ChartIcon className="w-8 h-8 text-primary" />

// Mobile
<UsersIcon className="w-6 h-6 text-muted" />
```

## 🎯 Status Atual

| Ícone | Página | Status |
|-------|--------|--------|
| home.svg | APRENDER | ✅ Existe |
| chart.svg | PROGRESSO | ❌ **FALTA** |
| users.svg | EQUIPE | ❌ **FALTA** |
| trophy.svg | RANKINGS | ✅ Existe |
| user.svg | PERFIL | ✅ Existe |

---

**Última atualização:** 2025-01-01
