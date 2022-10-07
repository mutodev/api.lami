import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { IntegrationModule } from './integration.module';

const logger = new Logger('Auth');

async function bootstrap() {

  // const app = await NestFactory.create(IntegrationModule);
  // await app.listen(3000);

  const appMS = await NestFactory.createMicroservice(IntegrationModule, {
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379',
    },
  });

  await appMS.listen();
  logger.log('Microservice integration is listening');

}
bootstrap();
