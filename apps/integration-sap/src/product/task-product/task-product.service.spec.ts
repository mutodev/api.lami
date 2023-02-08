import { Test, TestingModule } from '@nestjs/testing';
import { TaskProductService } from './task-product.service';

describe('TaskProductService', () => {
  let service: TaskProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskProductService],
    }).compile();

    service = module.get<TaskProductService>(TaskProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
