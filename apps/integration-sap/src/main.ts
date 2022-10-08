import { INestMicroservice, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IntegrationSapModule } from './integration-sap.module';

const logger = new Logger('Integration sap');

async function bootstrap() {
  // const app = await NestFactory.create(IntegrationSapModule);
  // await app.listen(1201);

  const app = await NestFactory.create(IntegrationSapModule);

  app.enableCors();

  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle("Lami api")
    .setDescription('')
    .setVersion('1.0')
    .addTag('Servicios')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );

  await app.listen(1201);

  const appMS: INestMicroservice = await NestFactory.createMicroservice(IntegrationSapModule, {
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379'
    }
  });

  await appMS.listen();
  logger.log('Microservice integration sap is listening');
}
bootstrap();
