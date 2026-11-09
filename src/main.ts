import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

try {
  process.loadEnvFile();
} catch {
  // No .env file: fall back to defaults / real environment variables.
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3003',
  });
  await app.listen(process.env.PORT ?? 4002);
}
await bootstrap();
