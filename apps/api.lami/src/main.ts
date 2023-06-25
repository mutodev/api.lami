import { INestMicroservice, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorsInterceptor, ResponseInterceptor } from './commons/interceptors';
import { HTTPLoggingInterceptor } from './commons/interceptors/http-logging.interceptor';
import { LoggerApplication } from './commons/loggers/rotate.log';

const logger = new Logger('Api lami');

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('/api');

  app.use(
    LoggerApplication()
  );

  const config = new DocumentBuilder()
    .setTitle("Lami api")
    .setDescription('')
    .setVersion('1.0')
    .addTag('Servicios')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalInterceptors(new ErrorsInterceptor(), new ResponseInterceptor(), new HTTPLoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );

  await app.listen(process.env.PORT || 1200);

  const appMS: INestMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379
    }
  });

  await appMS.listen();
  logger.log('Microservice integration sap is listening');

}
bootstrap();
