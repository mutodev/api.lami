import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { EnumApis } from '../commons/enum-apis';

@Injectable()
export class AuthService {

  constructor(private httpService: HttpService,
              private _env: EasyconfigService) {}
  login() {
    try {
      this.httpService.post(`${this._env.get('URL_BASE_SAP')}${EnumApis.LOGIN}`, 
      {
        "UserName":"INTEGRACIONES",
        "Password":"1234",
        "CompanyDB":"PRUEBAS_QUANTA_JUNIO",
    })
    } catch (error) {
      throw error;
    }
  }
  
}
