# 🎯 Backend API - NestJS

## 📋 Visão Geral

Backend desenvolvido com **NestJS** seguindo princípios de **Clean Architecture**.

## 🏗️ Estrutura (Clean Architecture)

```
src/
├── core/                      # 🎯 Camada de domínio (regras de negócio)
│   ├── domain/
│   │   ├── entities/          # Entidades do domínio
│   │   ├── repositories/      # Interfaces dos repositórios
│   │   └── use-cases/         # Casos de uso
│   └── ports/                 # Interfaces para serviços externos
│
├── application/               # 🔄 Camada de aplicação (orquestração)
│   ├── auth/                  # Autenticação e autorização
│   ├── users/                 # Gestão de usuários
│   ├── weather/               # Gestão de dados climáticos
│   └── insights/              # Geração de insights
│
├── infrastructure/            # 🛠️ Implementações concretas
│   ├── database/
│   │   ├── mongodb/           # Configuração MongoDB
│   │   └── repositories/      # Implementação dos repositórios
│   ├── external-apis/         # Clientes de APIs externas
│   ├── ai/                    # Integração com IA
│   └── export/                # Exportação de dados
│
├── presentation/              # 🌐 Camada de apresentação (HTTP)
│   ├── controllers/           # Endpoints REST
│   ├── dtos/                  # Data Transfer Objects
│   ├── guards/                # Guards de autenticação
│   └── filters/               # Filtros de exceção
│
├── shared/                    # 📦 Código compartilhado
│   ├── decorators/            # Decorators customizados
│   ├── pipes/                 # Validation pipes
│   └── utils/                 # Utilitários
│
└── config/                    # ⚙️ Configurações
```

## 📦 Instalação

```bash
npm install
```

## 🚀 Executar

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## 🧪 Testes

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📊 Endpoints Principais

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuário atual

### Usuários
- `GET /api/users` - Listar
- `POST /api/users` - Criar
- `PATCH /api/users/:id` - Atualizar
- `DELETE /api/users/:id` - Remover

### Weather
- `GET /api/weather/logs` - Listar logs
- `POST /api/weather/logs` - Criar log
- `GET /api/weather/export/csv` - Exportar CSV
- `GET /api/weather/export/xlsx` - Exportar XLSX

### Insights
- `GET /api/insights` - Listar insights
- `POST /api/insights/generate` - Gerar insights

## 🔐 Variáveis de Ambiente

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gdash-weather
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@gdash.com
ADMIN_PASSWORD=Admin@123456
```

## 📖 Documentação da API

Swagger disponível em: http://localhost:3000/api
