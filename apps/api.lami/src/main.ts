import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorsInterceptor, ResponseInterceptor } from './commons/interceptors';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

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

  app.useGlobalInterceptors(new ErrorsInterceptor(), new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );

  await app.listen(1200);

}
bootstrap();
