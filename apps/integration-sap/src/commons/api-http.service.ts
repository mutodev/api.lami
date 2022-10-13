import { HttpService } from '@nestjs/axios';
import { Global, Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { firstValueFrom } from 'rxjs';

@Global()
@Injectable()
export class ApiHttp {

    constructor(private httpService: HttpService,
        private _env: EasyconfigService) {}

    async get<T>(endPoint: string, data?: any) {
        const subscription = await this.httpService.get<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, {
            params: data
        });
        const result = await firstValueFrom(subscription);
        console.log({result})
        return result.data;
    }

    async post<T>(endPoint: string, data?: any) {
        const subscription = await this.httpService.post<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, data);
        const result = await firstValueFrom(subscription);
        console.log({result})
        return result.data;
    }

    async put<T>(endPoint: string, data?: any) {
        const subscription = await this.httpService.put<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, data);
        const result = await firstValueFrom(subscription);
        console.log({result})
        return result.data;
    }

    async patch<T>(endPoint: string, data?: any) {
        const subscription = await this.httpService.patch<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, data);
        const result = await firstValueFrom(subscription);
        console.log({result})
        return result.data;
    }

    async delete<T>(endPoint: string, data?: any) {
        const subscription = await this.httpService.delete<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`);
        const result = await firstValueFrom(subscription);
        console.log({result})
        return result.data;
    }
}