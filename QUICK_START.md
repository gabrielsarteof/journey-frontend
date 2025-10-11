# 🚀 Guia de Início Rápido - Journey Frontend

## Configuração em 3 Passos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

**Importante**: Não é necessário alterar o `.env` - já está configurado com valores padrão!

### 3️⃣ Iniciar Servidor

```bash
npm run dev
```

✅ **Pronto!** Acesse: http://localhost:3000

---

## ⚙️ Configuração Padrão

| Configuração | Valor | Descrição |
|-------------|-------|-----------|
| **Porta Frontend** | `3000` | Compatível com CORS do backend |
| **Porta Backend** | `8000` | API URL configurada |
| **Timeout API** | `30s` | Timeout padrão de requisições |

---

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Porta 3000 (configurada no .env)
npm run dev:3000     # Força porta 3000

# Build
npm run build        # Build para produção

# Preview
npm run preview      # Preview do build
npm run preview:3000 # Preview na porta 3000

# Qualidade
npm run lint         # Linting do código
```

---

## 📋 Checklist de Verificação

Antes de começar, certifique-se:

- [ ] Node.js 18+ instalado
- [ ] Backend rodando em `http://localhost:8000`
- [ ] Porta 3000 disponível (não sendo usada)
- [ ] Arquivo `.env` criado

---

## 🔍 Verificar se Tudo Está Funcionando

### 1. Frontend Rodando?

```bash
# Deve retornar: Vite server running
curl http://localhost:3000
```

### 2. Backend Conectado?

Abra o navegador em `http://localhost:3000` e tente fazer login.

**Se der erro de CORS**:
- ✅ Frontend está na porta 3000?
- ✅ Backend está rodando?
- ✅ Backend tem CORS configurado para `http://localhost:3000`?

---

## ❌ Troubleshooting

### Erro: "Port 3000 is already in use"

**Solução 1**: Matar processo na porta 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

**Solução 2**: Usar porta alternativa (temporário)
```bash
npm run dev -- --port 3001
```
⚠️ **Atenção**: Isso causará erros de CORS!

---

### Erro: CORS Policy

```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3001'
has been blocked by CORS policy
```

**Causa**: Frontend não está na porta 3000.

**Solução**:
```bash
npm run dev:3000  # Força porta 3000
```

---

### Erro: "Cannot connect to backend"

**Verificações**:

1. Backend está rodando?
```bash
curl http://localhost:8000/health
```

2. URL do backend está correta no `.env`?
```env
VITE_API_BASE_URL=http://localhost:8000
```

3. Timeout não está muito baixo?
```env
VITE_API_TIMEOUT=30000
```

---

## 🏗️ Estrutura do Projeto

```
journey-frontend/
├── src/
│   ├── features/auth/         # Módulo de autenticação
│   │   ├── domain/            # Lógica de negócio
│   │   ├── infrastructure/    # APIs, repos
│   │   ├── application/       # Stores, hooks
│   │   └── presentation/      # UI components
│   ├── shared/                # Código compartilhado
│   └── routes/                # Definição de rotas
├── docs/                      # Documentação técnica
├── .env                       # Variáveis de ambiente
└── vite.config.ts             # Configuração do Vite
```

---

## 📚 Documentação Adicional

- [README.md](./README.md) - Documentação completa do projeto
- [docs/SERVER_CONFIGURATION.md](./docs/SERVER_CONFIGURATION.md) - Detalhes sobre configuração de porta
- [docs/ERROR_HANDLING_ARCHITECTURE.md](./docs/ERROR_HANDLING_ARCHITECTURE.md) - Arquitetura de erros

---

## 🎯 Próximos Passos

Após iniciar o projeto:

1. **Acesse a Landing Page**: http://localhost:3000
2. **Teste o Registro**: http://localhost:3000/auth/register
3. **Teste o Login**: http://localhost:3000/auth/login

---

## 💡 Dicas

### Desenvolvimento Eficiente

```bash
# Terminal 1: Backend
cd ../devcoachai_backend
npm run dev

# Terminal 2: Frontend
cd journey-frontend
npm run dev
```

### Hot Reload

O Vite detecta mudanças automaticamente! Edite arquivos em `src/` e veja as mudanças em tempo real.

### DevTools

- React DevTools: Instalado via browser extension
- TanStack Router DevTools: Habilitado em dev mode
- Zustand DevTools: Disponível via Redux DevTools

---

## ✅ Tudo Funcionando!

Se você chegou até aqui e tudo está rodando:

```
✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:8000
✅ CORS: Configurado
✅ Autenticação: Funcionando
```

**Bom desenvolvimento! 🚀**
