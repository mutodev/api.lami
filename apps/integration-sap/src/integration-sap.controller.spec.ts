import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationSapController } from './integration-sap.controller';
import { IntegrationSapService } from './integration-sap.service';

describe('IntegrationSapController', () => {
  let integrationSapController: IntegrationSapController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationSapController],
      providers: [IntegrationSapService],
    }).compile();

    integrationSapController = app.get<IntegrationSapController>(IntegrationSapController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(integrationSapController.getHello()).toBe('Hello World!');
    });
  });
});
