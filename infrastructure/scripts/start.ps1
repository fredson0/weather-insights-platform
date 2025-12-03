# Script de inicialização para Windows PowerShell

Write-Host "🚀 Iniciando GDASH Weather Insights..." -ForegroundColor Cyan

# Verificar se .env existe
if (-not (Test-Path "..\..\\.env")) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host "📋 Copiando .env.example para .env..." -ForegroundColor Blue
    Copy-Item "..\..\\.env.example" "..\..\\.env"
    Write-Host "✅ Arquivo .env criado! Por favor, configure as variáveis necessárias." -ForegroundColor Green
    exit 1
}

# Verificar se Docker está rodando
try {
    docker info | Out-Null
    Write-Host "🐳 Docker está rodando..." -ForegroundColor Blue
} catch {
    Write-Host "⚠️  Docker não está rodando!" -ForegroundColor Yellow
    Write-Host "Por favor, inicie o Docker Desktop e tente novamente."
    exit 1
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Blue
docker-compose -f ..\docker\docker-compose.yml down

# Build das imagens
Write-Host "🔨 Construindo imagens Docker..." -ForegroundColor Blue
docker-compose -f ..\docker\docker-compose.yml build

# Iniciar serviços
Write-Host "🚀 Iniciando serviços..." -ForegroundColor Blue
docker-compose -f ..\docker\docker-compose.yml up -d

# Aguardar serviços ficarem prontos
Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Blue
Start-Sleep -Seconds 10

# Verificar status
Write-Host "📊 Status dos serviços:" -ForegroundColor Blue
docker-compose -f ..\docker\docker-compose.yml ps

Write-Host ""
Write-Host "✅ Sistema iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs disponíveis:" -ForegroundColor Blue
Write-Host "  Frontend:     http://localhost:5173"
Write-Host "  API:          http://localhost:3000"
Write-Host "  API Docs:     http://localhost:3000/api"
Write-Host "  RabbitMQ UI:  http://localhost:15672 (admin/admin123)"
Write-Host ""
Write-Host "📝 Login padrão (configurável no .env):" -ForegroundColor Yellow
Write-Host "  Email: admin@gdash.com"
Write-Host "  Senha: Admin@123456"
Write-Host ""
Write-Host "📋 Comandos úteis:" -ForegroundColor Blue
Write-Host "  Ver logs:           docker-compose -f ..\docker\docker-compose.yml logs -f"
Write-Host "  Parar serviços:     docker-compose -f ..\docker\docker-compose.yml down"
Write-Host "  Reiniciar:          docker-compose -f ..\docker\docker-compose.yml restart"
Write-Host ""
