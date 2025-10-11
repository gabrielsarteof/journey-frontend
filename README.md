# Journey Frontend

Frontend do Journey - Plataforma de aprendizado com IA ética e segura.

## 🚀 Tecnologias

- **React 19** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **TanStack Router** - Roteamento type-safe
- **Zustand** - Gerenciamento de estado
- **Tailwind CSS** - Estilização
- **Zod** - Validação de schemas
- **Vite** - Build tool

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando na porta 8000

**Importante**: O frontend está configurado para rodar na **porta 3000** para compatibilidade com o CORS do backend.

## ⚙️ Configuração

1. **Clone o repositório**
```bash
git clone <repository-url>
cd journey-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
# Server Configuration
VITE_PORT=3000                          # Porta do servidor (compatível com CORS)
VITE_HOST=localhost

# API Configuration
VITE_API_BASE_URL=http://localhost:8000 # Backend URL
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_STORAGE_KEY=journey_access_token
VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY=journey_refresh_token

# Feature Flags
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_AUTH_PERSISTENCE=true
```

4. **Execute o projeto**
```bash
npm run dev        # Roda na porta configurada no .env (3000)
# ou
npm run dev:3000   # Força porta 3000 (override)
```

O aplicativo estará disponível em: **http://localhost:3000**

## 🏗️ Arquitetura

O projeto segue Clean Architecture com separação clara de responsabilidades:

```
src/
├── features/
│   └── auth/
│       ├── domain/          # Entidades, interfaces, schemas
│       ├── infrastructure/   # APIs, repositórios
│       ├── application/      # Stores, hooks
│       └── presentation/     # Páginas, componentes
├── shared/
│   ├── components/          # Componentes reutilizáveis
│   └── config/             # Configurações globais
└── routes/                 # Definição de rotas
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento (porta configurada no .env)
- `npm run dev:3000` - Servidor de desenvolvimento forçando porta 3000
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run preview:3000` - Preview na porta 3000
- `npm run lint` - Linting do código

## 🌍 Variáveis de Ambiente

### Obrigatórias
- `VITE_API_BASE_URL` - URL do backend
- `VITE_APP_NAME` - Nome da aplicação
- `VITE_PORT` - Porta do servidor (padrão: 3000)

### Opcionais
- `VITE_HOST` - Host do servidor (padrão: localhost)
- `VITE_API_TIMEOUT` - Timeout das requisições (padrão: 30000ms)
- `VITE_ENABLE_DEV_TOOLS` - Habilita ferramentas de dev (padrão: true)
- `VITE_ENABLE_AUTH_PERSISTENCE` - Persiste autenticação (padrão: true)
- `VITE_DEBUG_MODE` - Modo debug (padrão: true)

📖 **Documentação Completa**: Veja [docs/SERVER_CONFIGURATION.md](./docs/SERVER_CONFIGURATION.md) para detalhes sobre configuração de porta e troubleshooting.

## 🔐 Autenticação

O sistema de autenticação implementa:

- JWT Access Tokens (curta duração)
- Refresh Tokens (7 dias)
- Persistência configurável
- Renovação automática de tokens
- Logout seguro

## 🎯 Funcionalidades

- ✅ Landing Page
- ✅ Registro de usuário
- ✅ Login/Logout
- ✅ Validação de formulários
- ✅ Gerenciamento de estado
- ✅ Persistência de sessão
- ✅ Tratamento de erros

## 📱 Rotas

- `/` - Landing Page
- `/auth/login` - Página de login
- `/auth/register` - Página de registro

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
