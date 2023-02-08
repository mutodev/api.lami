import { Test, TestingModule } from '@nestjs/testing';
import { TaskCustomerService } from './task-customer.service';

describe('TaskCustomerService', () => {
  let service: TaskCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskCustomerService],
    }).compile();

    service = module.get<TaskCustomerService>(TaskCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
