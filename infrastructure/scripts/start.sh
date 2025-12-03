#!/bin/bash

# Script de inicialização completa do projeto
echo "🚀 Iniciando GDASH Weather Insights..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se .env existe
if [ ! -f "../../.env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    echo -e "${BLUE}📋 Copiando .env.example para .env...${NC}"
    cp ../../.env.example ../../.env
    echo -e "${GREEN}✅ Arquivo .env criado! Por favor, configure as variáveis necessárias.${NC}"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker não está rodando!${NC}"
    echo "Por favor, inicie o Docker Desktop e tente novamente."
    exit 1
fi

echo -e "${BLUE}🐳 Docker está rodando...${NC}"

# Parar containers existentes
echo -e "${BLUE}🛑 Parando containers existentes...${NC}"
docker-compose down

# Limpar volumes antigos (opcional - comentado por padrão)
# echo -e "${YELLOW}🗑️  Limpando volumes antigos...${NC}"
# docker-compose down -v

# Build das imagens
echo -e "${BLUE}🔨 Construindo imagens Docker...${NC}"
docker-compose build

# Iniciar serviços
echo -e "${BLUE}🚀 Iniciando serviços...${NC}"
docker-compose up -d

# Aguardar serviços ficarem prontos
echo -e "${BLUE}⏳ Aguardando serviços iniciarem...${NC}"
sleep 10

# Verificar status
echo -e "${BLUE}📊 Status dos serviços:${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}✅ Sistema iniciado com sucesso!${NC}"
echo ""
echo -e "${BLUE}🌐 URLs disponíveis:${NC}"
echo "  Frontend:     http://localhost:5173"
echo "  API:          http://localhost:3000"
echo "  API Docs:     http://localhost:3000/api"
echo "  RabbitMQ UI:  http://localhost:15672 (admin/admin123)"
echo ""
echo -e "${YELLOW}📝 Login padrão (configurável no .env):${NC}"
echo "  Email: admin@gdash.com"
echo "  Senha: Admin@123456"
echo ""
echo -e "${BLUE}📋 Comandos úteis:${NC}"
echo "  Ver logs:           docker-compose logs -f"
echo "  Parar serviços:     docker-compose down"
echo "  Reiniciar:          docker-compose restart"
echo ""
