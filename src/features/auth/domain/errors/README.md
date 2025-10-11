# Sistema de Tratamento de Erros de Autenticação

## Visão Geral

Sistema robusto de tratamento de erros implementado seguindo Clean Architecture, DDD e SOLID.

## Estrutura de Arquivos

```
src/features/auth/domain/
├── errors/
│   ├── AuthErrorCodes.ts      # Catálogo de códigos de erro
│   ├── AuthErrorMessages.ts   # Mensagens localizadas em PT-BR
│   ├── AuthDomainError.ts     # Value Object para erros
│   └── index.ts               # Exports públicos
├── mappers/
│   ├── AuthErrorMapper.ts     # Mapeador de erros da API
│   └── index.ts
```

## Como Usar

### 1. Capturar Erros da API

O sistema automaticamente captura e traduz erros:

```typescript
try {
  await login(credentials);
} catch (error) {
  // Erro já está localizado em português
  if (error instanceof AuthDomainError) {
    console.log(error.title);           // "Credenciais Inválidas"
    console.log(error.message);         // "O email ou senha informados..."
    console.log(error.actionHint);      // "Verifique suas credenciais..."
    console.log(error.getDisplayMessage()); // Mensagem completa
  }
}
```

### 2. Criar Erros Customizados

```typescript
import { AuthErrorMapper } from '../mappers/AuthErrorMapper';
import { AuthErrorCodes } from '../errors/AuthErrorCodes';

const customError = AuthErrorMapper.createDomainError(
  AuthErrorCodes.VALIDATION_FAILED,
  400,
  [{ field: 'email', code: 'invalid', message: 'Email inválido' }]
);
```

### 3. Exibir Erros na UI

```typescript
// No componente React
{error && (
  <ErrorMessage
    message={error}  // Já vem localizado do authStore
    onDismiss={clearError}
  />
)}
```

## Códigos de Erro Disponíveis

| Código | Status | Uso |
|--------|--------|-----|
| `INVALID_CREDENTIALS` | 401 | Login com credenciais incorretas |
| `EMAIL_ALREADY_EXISTS` | 400 | Registro com email já cadastrado |
| `TOKEN_EXPIRED` | 401 | Sessão expirada |
| `TOKEN_INVALID` | 401 | Token inválido ou comprometido |
| `VALIDATION_FAILED` | 400 | Dados de formulário inválidos |
| `REQUEST_TIMEOUT` | 408 | Timeout na requisição |
| `NETWORK_ERROR` | 500 | Erro de conexão |
| `UNAUTHORIZED` | 401 | Acesso não autorizado |

## Fluxo de Erro

```
API Error → HttpClient → AuthErrorMapper → AuthDomainError → authStore → UI
```

## Benefícios

- ✅ Mensagens em português brasileiro
- ✅ Type-safe com TypeScript
- ✅ Rastreabilidade completa
- ✅ Fail-safe (nunca quebra)
- ✅ Testável e manutenível
- ✅ Seguindo Clean Architecture

## Documentação Completa

Veja [ERROR_HANDLING_ARCHITECTURE.md](../../../../docs/ERROR_HANDLING_ARCHITECTURE.md) para documentação técnica detalhada.
