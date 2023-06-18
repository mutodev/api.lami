import { HttpService } from '@nestjs/axios';
import { Global, Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { firstValueFrom } from 'rxjs';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';

@Injectable()
export class AuthService {

  constructor(private apiHttp: ApiHttp) {}

  async login() {
    try {
      const result = await this.apiHttp.login();
      // console.log({result})
      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  
}
