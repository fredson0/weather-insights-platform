# 🎨 Frontend - React + Vite

## 📋 Visão Geral

Frontend moderno com **React 18**, **Vite**, **Tailwind CSS** e **shadcn/ui**.

## 🏗️ Estrutura (Feature-First)

```
src/
├── features/                  # 🎯 Features do app
│   ├── auth/
│   │   ├── components/        # Login, Register
│   │   ├── hooks/             # useAuth, useLogin
│   │   ├── services/          # authService
│   │   └── types/             # AuthTypes
│   ├── dashboard/
│   │   ├── components/        # WeatherCards, Charts
│   │   ├── hooks/             # useWeather, useInsights
│   │   └── services/          # weatherService
│   ├── users/
│   │   ├── components/        # UserTable, UserForm
│   │   └── services/          # userService
│   └── explore/               # API pública (opcional)
│
├── shared/                    # 📦 Compartilhado
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Hooks genéricos
│   ├── lib/                   # Configurações
│   ├── types/                 # TypeScript types
│   └── utils/                 # Funções utilitárias
│
├── core/                      # ⚙️ Core do app
│   ├── api/                   # Axios setup
│   ├── router/                # React Router
│   └── contexts/              # React Context
│
└── assets/                    # 🖼️ Imagens, ícones
```

## 📦 Instalação

```bash
npm install
```

## 🚀 Executar

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

## 🎨 shadcn/ui Components

### Instalar componente
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add toast
```

## 🔐 Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=GDASH Weather Insights
```

## 📱 Páginas

- `/` - Dashboard (protegida)
- `/login` - Login
- `/users` - Gerenciamento de usuários (protegida)
- `/explore` - API pública (opcional)

## 🎨 Tailwind Config

Tailwind já configurado com:
- ✅ Tema personalizado
- ✅ Dark mode
- ✅ Variáveis CSS do shadcn/ui
