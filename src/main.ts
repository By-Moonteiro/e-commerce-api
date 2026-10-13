import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { StandardSchemaValidationPipe } from '@nestjs/common';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('PORT') || 3000;

  app.useGlobalPipes(new StandardSchemaValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API para um sistema de e-commerce')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  app.use(
    '/docs',
    apiReference({
      content: document,
      withFastify: true,
      theme: 'deepSpace',
    }),
  );

  await app.listen(port);
}
await bootstrap();
