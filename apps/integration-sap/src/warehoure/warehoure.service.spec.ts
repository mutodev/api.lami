import { Test, TestingModule } from '@nestjs/testing';
import { WarehoureService } from './warehoure.service';

describe('WarehoureService', () => {
  let service: WarehoureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehoureService],
    }).compile();

    service = module.get<WarehoureService>(WarehoureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
