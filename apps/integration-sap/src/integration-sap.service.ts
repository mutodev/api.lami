import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationSapService {
  getHello(): string {
    return 'Hello World!';
  }
}
