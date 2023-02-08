import { Test, TestingModule } from '@nestjs/testing';
import { TaskOrderService } from './task-order.service';

describe('TaskOrderService', () => {
  let service: TaskOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskOrderService],
    }).compile();

    service = module.get<TaskOrderService>(TaskOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
