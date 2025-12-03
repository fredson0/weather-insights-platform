# Arquivos base para você implementar

## 📁 Core Layer (Domain)

### Entities
- `user.entity.ts` - Entidade de usuário (regras de negócio)
- `weather-log.entity.ts` - Entidade de log climático
- `insight.entity.ts` - Entidade de insight

### Repositories (Interfaces)
- `user.repository.interface.ts` - Interface do repositório de usuários
- `weather-log.repository.interface.ts` - Interface do repositório de logs
- `insight.repository.interface.ts` - Interface do repositório de insights

### Use Cases
- `create-user.use-case.ts` - Caso de uso: criar usuário
- `authenticate-user.use-case.ts` - Caso de uso: autenticar usuário
- `save-weather-data.use-case.ts` - Caso de uso: salvar dados climáticos
- `generate-insights.use-case.ts` - Caso de uso: gerar insights

### Ports
- `ai-service.port.ts` - Interface para serviço de IA
- `export-service.port.ts` - Interface para exportação
- `external-api.port.ts` - Interface para APIs externas
