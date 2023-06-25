import { Test, TestingModule } from '@nestjs/testing';
import { CustomerGateway } from './customer.gateway';

describe('CustomerGateway', () => {
  let gateway: CustomerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerGateway],
    }).compile();

    gateway = module.get<CustomerGateway>(CustomerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
