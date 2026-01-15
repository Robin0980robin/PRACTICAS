import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  logger.log(`🚀 Backend NestJS corriendo en http://localhost:${port}`);
  logger.log(`📊 Endpoints disponibles:`);
  logger.log(`   POST   /prestamos`);
  logger.log(`   GET    /prestamos`);
  logger.log(`   GET    /prestamos/:id`);
  logger.log(`   PUT    /prestamos/:id/devolver`);
  logger.log(`   POST   /prestamos/verificar-vencidos`);
}

bootstrap();
