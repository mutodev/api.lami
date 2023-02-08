import { INestMicroservice, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorsInterceptor, ResponseInterceptor } from './commons/interceptors';
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

  app.useGlobalInterceptors(new ErrorsInterceptor(), new ResponseInterceptor());

  await app.listen(1202);

  const appMS: INestMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(IntegrationSapModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
      retryAttempts: 3,
      retryDelay: 1000
    }
  });

  await appMS.listen();
  logger.log('Microservice integration sap is listening');
}
bootstrap();
