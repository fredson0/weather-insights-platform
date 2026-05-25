import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './presentation/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('GDASH Weather Insights API')
    .setDescription(
      'Sistema de monitoramento climático em tempo real com insights gerados por IA.\n\n' +
      '**Pipeline:** Python Collector → RabbitMQ → Go Worker → NestJS API → MongoDB\n\n' +
      '**Credenciais padrão:**\n' +
      '- Email: admin@example.com\n' +
      '- Senha: 123456'
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Cole o token JWT recebido no login',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Desenvolvimento Local')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'GDASH Weather API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`API rodando em: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api`);
  console.log(`Health check: http://localhost:${port}/health`);
}

bootstrap();
