import { Test, TestingModule } from '@nestjs/testing';
import { WarehoureController } from './warehoure.controller';
import { WarehoureService } from './warehoure.service';

describe('WarehoureController', () => {
  let controller: WarehoureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehoureController],
      providers: [WarehoureService],
    }).compile();

    controller = module.get<WarehoureController>(WarehoureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
