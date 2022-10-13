import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { firstValueFrom } from 'rxjs';
import { ApiHttp } from '../commons/api-http.service';
import { EnumApis } from '../commons/enum-apis';

@Injectable()
export class AuthService {

  constructor(private apiHttp: ApiHttp,
              private _env: EasyconfigService) {}

  async login() {
    try {
      const data = JSON.parse(this._env.get('CREDENTIALS_SAP'));
      const result = await this.apiHttp.post<any>(EnumApis.LOGIN, data);
      console.log({result})
      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  
}
