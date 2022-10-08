import { INestMicroservice, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { IntegrationSapModule } from './integration-sap.module';

const logger = new Logger('Integration sap');

async function bootstrap() {
  const app = await NestFactory.create(IntegrationSapModule);
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
