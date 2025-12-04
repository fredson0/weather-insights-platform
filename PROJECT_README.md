# 📊 GDASH Weather Insights

> Sistema full-stack de monitoramento climático com insights gerados por IA

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)](https://golang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📹 Vídeo Explicativo

**[▶️ Assistir vídeo no YouTube](docs/video-link.md)** (5 minutos)

---

## 🎯 Sobre o Projeto

Sistema de monitoramento climático em tempo real que:
- ☁️ Coleta dados meteorológicos automaticamente
- 🤖 Gera insights inteligentes usando IA
- 📊 Visualiza tendências em dashboard interativo
- 📤 Exporta dados em CSV/XLSX
- 🔐 Gerencia usuários com autenticação JWT

### 🏗️ Arquitetura

**Clean Architecture** no backend + **Feature-First** no frontend

```
Python Collector → RabbitMQ → Go Worker → NestJS API → MongoDB
                                              ↓
                                        React Frontend
```

📖 **[Documentação completa da arquitetura](docs/architecture.md)**

---

## 🚀 Quick Start (Docker - Recomendado)

### Pré-requisitos

- **APENAS** [Docker Desktop](https://www.docker.com/get-started) instalado
- [Git](https://git-scm.com/)

**Não precisa instalar:** Node.js, Python, Go, MongoDB, RabbitMQ - tudo roda no Docker! ✅

---

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/fredson0/desafio-gdash-2025-02.git
cd desafio-gdash-2025-02
```

### 2️⃣ Configure as variáveis de ambiente

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

**Edite o `.env` e ajuste (OPCIONAL):**
- `WEATHER_LATITUDE` e `WEATHER_LONGITUDE` - Sua localização (padrão: São Paulo)
- `JWT_SECRET` - Chave secreta (padrão já configurado)
- `ADMIN_EMAIL` e `ADMIN_PASSWORD` - Login inicial (padrão já configurado)

### 3️⃣ Inicie TODOS os serviços com Docker

```bash
# Navegar até a pasta do docker-compose
cd infrastructure/docker

# Subir todos os containers (⏱️ primeira vez: 2-5 min)
docker-compose up -d
```

**O que acontece:**
- ✅ Baixa imagens Docker (Node, Python, Go, MongoDB, RabbitMQ)
- ✅ Instala dependências automaticamente (npm, pip, go mod)
- ✅ Roda build dos serviços
- ✅ Inicia todos os containers

### 4️⃣ Aguarde inicialização (30-60 segundos)

```bash
# Verificar status dos serviços
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api
```

### 5️⃣ Acesse a aplicação

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Ver `.env` |
| **API** | http://localhost:3000 | - |
| **API Docs** | http://localhost:3000/api | - |
| **RabbitMQ UI** | http://localhost:15672 | admin / admin123 |

---

## 🔑 Login Padrão

```
Email: admin@gdash.com
Senha: Admin@123456
```

*(Configurável no `.env`)*

---

## 📦 Estrutura do Projeto

```
desafio-gdash-2025-02/
├── services/
│   ├── api/                # Backend NestJS (Clean Architecture)
│   ├── web/                # Frontend React + Vite + Tailwind
│   ├── collector/          # Python - Coleta de dados climáticos
│   └── worker/             # Go - Worker da fila
├── infrastructure/
│   ├── docker/             # Docker Compose
│   └── scripts/            # Scripts utilitários
├── docs/                   # Documentação
├── .env.example
└── README.md
```

---

## 🛠️ Stack Tecnológica

### Backend
- **NestJS** (TypeScript) - Framework Node.js
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Passport JWT** - Autenticação
- **Class Validator** - Validação de dados
- **ExcelJS** - Exportação XLSX
- **json2csv** - Exportação CSV

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Router** - Roteamento
- **Axios** - HTTP client
- **Recharts** - Gráficos
- **React Query** - Cache e estado

### Microserviços
- **Python 3.11** - Coletor de dados
  - `requests` / `httpx` - HTTP client
  - `pika` - RabbitMQ client
  - `schedule` - Agendamento de tarefas
- **Go 1.21** - Worker da fila
  - `amqp091-go` - RabbitMQ client
  - `net/http` - HTTP client

### Infraestrutura
- **Docker** & **Docker Compose**
- **RabbitMQ** - Message broker
- **MongoDB** - Banco de dados

### APIs Externas
- **Open-Meteo** - Dados climáticos (sem API key)
- **PokéAPI** - Exemplo de integração (opcional)
- **OpenAI/Anthropic** - IA para insights (opcional)

---

## 🎨 Funcionalidades

### ✅ Implementadas

- [x] **Dashboard de Clima**
  - [x] Cards com dados atuais
  - [x] Gráficos de temperatura/umidade
  - [x] Tabela de histórico
  - [x] Insights gerados por IA
  
- [x] **Autenticação**
  - [x] Login/Logout
  - [x] JWT tokens
  - [x] Rotas protegidas
  
- [x] **CRUD de Usuários**
  - [x] Listar usuários
  - [x] Criar usuário
  - [x] Editar usuário
  - [x] Remover usuário
  
- [x] **Exportação de Dados**
  - [x] Exportar CSV
  - [x] Exportar XLSX
  
- [x] **Pipeline de Dados**
  - [x] Python coleta dados (Open-Meteo)
  - [x] RabbitMQ gerencia fila
  - [x] Go consome e processa
  - [x] NestJS persiste no MongoDB

### 🔮 Opcionais

- [ ] Integração com API pública paginada (PokéAPI)
- [ ] Insights avançados com OpenAI
- [ ] Filtros no dashboard
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Deploy em produção

---

## 🧪 Desenvolvimento Local (Opcional)

**Use esta opção SE:**
- Você quer desenvolver e modificar o código
- Precisa de autocomplete/IntelliSense no VSCode
- Quer debugar localmente

**Pré-requisitos adicionais:**
- Node.js 20+
- Python 3.11+
- Go 1.21+
- MongoDB local ou Atlas
- RabbitMQ local

### Instalar dependências

#### Backend (NestJS)

```bash
cd services/api
npm install              # Instala dependências
npm run start:dev        # Roda em modo desenvolvimento
```

#### Frontend (React)

```bash
cd services/web
npm install              # Instala dependências
npm run dev              # Roda Vite dev server
```

#### Python Collector

```bash
cd services/collector
pip install -r requirements.txt    # Instala dependências
python main.py                     # Roda coletor
```

#### Go Worker

```bash
cd services/worker
go mod download          # Baixa dependências
go run cmd/worker/main.go  # Roda worker
```

**⚠️ Nota:** Para desenvolvimento local, você precisa:
1. MongoDB rodando (local ou Atlas)
2. RabbitMQ rodando (local ou Docker)
3. Configurar `.env` com URLs locais

---

## 📊 Endpoints da API

### Autenticação
```
POST /api/auth/login      # Login
POST /api/auth/register   # Registro
GET  /api/auth/me         # Usuário atual
```

### Usuários
```
GET    /api/users         # Listar usuários
GET    /api/users/:id     # Buscar usuário
POST   /api/users         # Criar usuário
PATCH  /api/users/:id     # Atualizar usuário
DELETE /api/users/:id     # Remover usuário
```

### Weather
```
GET  /api/weather/logs           # Listar logs climáticos
POST /api/weather/logs           # Criar log (usado pelo Go Worker)
GET  /api/weather/export/csv     # Exportar CSV
GET  /api/weather/export/xlsx    # Exportar XLSX
```

### Insights
```
GET  /api/insights               # Listar insights
POST /api/insights/generate      # Gerar novos insights
```

**📖 Swagger:** http://localhost:3000/api

---

## 🐳 Comandos Docker Úteis

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api

# Rebuild de um serviço
docker-compose up -d --build api

# Limpar volumes (⚠️ apaga dados)
docker-compose down -v
```

---

## 🔧 Troubleshooting

### ❌ Erro ao conectar no MongoDB

```bash
# Verificar se o MongoDB está rodando
docker-compose ps mongodb

# Ver logs do MongoDB
docker-compose logs mongodb
```

### ❌ Frontend não conecta na API

Verifique a variável `VITE_API_URL` no `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### ❌ RabbitMQ não conecta

```bash
# Acessar UI do RabbitMQ
http://localhost:15672
# User: admin | Pass: admin123

# Verificar se a fila existe
# Exchanges → weather-exchange
# Queues → weather-data
```

### ❌ Python Collector não envia dados

```bash
# Ver logs do collector
docker-compose logs collector

# Verificar coordenadas no .env
WEATHER_LATITUDE=-23.5505
WEATHER_LONGITUDE=-46.6333
```

---

## 📝 Decisões Técnicas

### Por que Clean Architecture?
- ✅ Separação clara de responsabilidades
- ✅ Código testável e manutenível
- ✅ Independente de frameworks
- ✅ Escalabilidade

### Por que RabbitMQ?
- ✅ Confiável e robusto
- ✅ Retry automático
- ✅ Dead letter queues
- ✅ Interface de gerenciamento

### Por que Open-Meteo?
- ✅ Gratuito e sem API key
- ✅ Dados precisos
- ✅ Sem limite de requisições (razoável)

---

## 👨‍💻 Autor

**Fredson Santana Machado Filho**

- GitHub: [@fredson0](https://github.com/fredson0)
- LinkedIn: [Seu LinkedIn](#)

---

## 📄 Licença

Este projeto foi desenvolvido como parte do processo seletivo GDASH 2025/02.

---

## 🙏 Agradecimentos

- **GDASH** pela oportunidade
- **Open-Meteo** pelos dados climáticos
- Comunidade open-source

---

**⭐ Se gostou do projeto, deixe uma estrela!**
