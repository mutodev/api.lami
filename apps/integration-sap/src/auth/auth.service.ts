import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { firstValueFrom } from 'rxjs';
import { EnumApis } from '../commons/enum-apis';

@Injectable()
export class AuthService {

  constructor(private httpService: HttpService,
              private _env: EasyconfigService) {}
  async login() {
    try {
      const data = JSON.parse(this._env.get('CREDENTIALS_SAP'));
      const subscription = await this.httpService.post(`${this._env.get('URL_BASE_SAP')}${EnumApis.LOGIN}`, data);
      const result = await firstValueFrom(subscription);
      console.log({result})
      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  
}
