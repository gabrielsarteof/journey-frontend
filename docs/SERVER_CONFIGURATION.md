# Configuração do Servidor de Desenvolvimento

## Porta Padrão

O projeto está configurado para rodar na **porta 3000**, alinhado com a configuração de CORS do backend.

## Configuração

### 1. Variáveis de Ambiente (.env)

```env
VITE_PORT=3000
VITE_HOST=localhost
```

### 2. Vite Config (vite.config.ts)

O arquivo `vite.config.ts` carrega as variáveis de ambiente e aplica configurações robustas:

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: parseInt(env.VITE_PORT || '3000', 10),
      host: env.VITE_HOST || 'localhost',
      strictPort: true,  // Falha se a porta já estiver em uso
      open: false,       // Não abre navegador automaticamente
      cors: true,        // Habilita CORS
    },
  }
})
```

### 3. Scripts NPM

```bash
# Desenvolvimento (usa .env automaticamente)
npm run dev

# Forçar porta 3000 (override)
npm run dev:3000

# Preview após build
npm run preview

# Preview na porta 3000
npm run preview:3000
```

## Opções de Configuração

### strictPort: true

**Benefício**: Falha imediatamente se a porta 3000 já estiver em uso, evitando confusão com o backend.

```bash
# Se a porta 3000 estiver ocupada:
Error: Port 3000 is already in use
```

**Sem strictPort**: Vite tentaria a próxima porta disponível (3001, 3002...), causando problemas de CORS.

### cors: true

**Benefício**: Habilita CORS no servidor de desenvolvimento, permitindo requisições do backend.

### open: false

**Benefício**: Não abre o navegador automaticamente, útil para desenvolvimento focado.

## Mudando a Porta

### Método 1: Variável de Ambiente (.env)

```env
VITE_PORT=3000  # Altere para a porta desejada
```

### Método 2: CLI Override

```bash
npm run dev -- --port 4000
```

### Método 3: Variável de Ambiente Inline

```bash
VITE_PORT=4000 npm run dev
```

## Compatibilidade com Backend

O backend (devcoachai-backend) está configurado com CORS para aceitar requisições de:

```
http://localhost:3000
```

**Importante**: Se alterar a porta do frontend, também atualize a configuração de CORS no backend!

## Troubleshooting

### Porta 3000 já está em uso

**Problema**:
```
Error: Port 3000 is already in use
```

**Soluções**:

1. **Verificar processos usando a porta**:
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

2. **Matar processo**:
```bash
# Windows (substitua <PID> pelo Process ID)
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

3. **Usar porta alternativa temporariamente**:
```bash
npm run dev -- --port 3001
```

### CORS Errors

**Problema**:
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3001'
has been blocked by CORS policy
```

**Solução**: Certifique-se de estar usando a porta 3000:
```bash
npm run dev:3000
```

## Arquitetura de Portas

```
┌─────────────────────────────────────┐
│  Frontend (React + Vite)            │
│  http://localhost:3000              │
│  - Configurado via VITE_PORT        │
│  - strictPort evita mudanças        │
└──────────────┬──────────────────────┘
               │
               │ HTTP Requests
               │
┌──────────────▼──────────────────────┐
│  Backend (Fastify)                  │
│  http://localhost:8000              │
│  - CORS: http://localhost:3000      │
└─────────────────────────────────────┘
```

## Melhores Práticas

1. ✅ **Sempre use .env** para configuração de porta
2. ✅ **Mantenha strictPort: true** para evitar surpresas
3. ✅ **Documente mudanças de porta** no backend também
4. ✅ **Use scripts npm** em vez de flags CLI
5. ✅ **Verifique CORS** ao alterar portas

## Ambientes

### Development

```env
VITE_PORT=3000
VITE_HOST=localhost
```

### Production Preview

```env
VITE_PORT=3000
VITE_HOST=0.0.0.0  # Permite acesso externo
```

### Docker

```dockerfile
EXPOSE 3000
ENV VITE_PORT=3000
```

## Referências

- [Vite Server Options](https://vitejs.dev/config/server-options.html)
- [Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- Backend CORS Configuration: `devcoachai_backend/src/config/cors.ts`
