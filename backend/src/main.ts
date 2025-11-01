import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { AppLogger } from './utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('app.apiPrefix');
  app.setGlobalPrefix(apiPrefix);

  // CORS
  const corsOrigin = configService.get<string>('app.corsOrigin');
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  // Security
  if (configService.get<boolean>('app.helmetEnabled')) {
    app.use(helmet());
  }

  // Compression
  if (configService.get<boolean>('app.compressionEnabled')) {
    app.use(compression());
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Get port
  const port = configService.get<number>('app.port');
  const nodeEnv = configService.get<string>('app.nodeEnv');

  await app.listen(port);

  AppLogger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
    'Bootstrap',
  );
  AppLogger.log(`📝 Environment: ${nodeEnv}`, 'Bootstrap');
  AppLogger.log(`🔗 CORS enabled for: ${corsOrigin}`, 'Bootstrap');
}

bootstrap();

