import { HttpService } from '@nestjs/axios';
import { Global, Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { firstValueFrom } from 'rxjs';
import { EnumApis } from './enum-apis';

@Global()
@Injectable()
export class ApiHttp {

    private SessionId: string;
    constructor(private httpService: HttpService,
        private _env: EasyconfigService) {}

    async login() {
        const data = JSON.parse(this._env.get('CREDENTIALS_SAP'));
        console.log()
        const subscription = await this.httpService.post<any>(`${this._env.get('URL_BASE_SAP')}${EnumApis.LOGIN}`, data);
        const result = await firstValueFrom(subscription);
        // console.log({result});
        this.SessionId = result.data.SessionId;
        return result.data;
    }  

    async get<T>(endPoint: string, data?: any) {
        try {
            const subscription = await this.httpService.get<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, {
                params: data,
                headers: {
                    'Cookie': `B1SESSION=${this.SessionId}`
                }
            });
            const result = await firstValueFrom(subscription);
            console.log(endPoint, {result})
            return {data: result.data, status: result.status};
        } catch (error) {
            console.log(endPoint, {error})
            let result = error?.response;
            return {message: result?.message || result?.statusText, status: result.status};
        }
    }

    async post<T>(endPoint: string, data?: any) {
        try {
            const subscription = await this.httpService.post<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, data, {
                headers: {
                    'Cookie': `B1SESSION=${this.SessionId}`
                }
            });
            const result = await firstValueFrom(subscription);
            console.log(endPoint, {result})
            return {data: result.data, status: result.status};
        } catch (error) {
            let result = error?.response;
            console.log(endPoint, {error, data: error?.response?.data})
            return {message: result?.message || result?.statusText, status: result.status};
        }
    }

    async put<T>(endPoint: string, data?: any) {
        try {
            const subscription = await this.httpService.put<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, data, {
                headers: {
                    'Cookie': `B1SESSION=${this.SessionId}`
                }
            });
            const result = await firstValueFrom(subscription);
            console.log({result})
            return {data: result.data, status: result.status};
        } catch (error) {
            let result = error?.response;
            return {message: result?.message || result?.statusText, status: result.status};
        }
    }

    async patch<T>(endPoint: string, data?: any) {
        try {
            const subscription = await this.httpService.patch<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, data, {
                headers: {
                    'Cookie': `B1SESSION=${this.SessionId}`
                }
            });
            const result = await firstValueFrom(subscription);
            console.log({result})
            return {data: result.data, status: result.status};
        } catch (error) {
            console.log(endPoint, {error})
            let result = error?.response;
            return {message: result?.message || result?.statusText, status: result.status};
        }       
    }

    async delete<T>(endPoint: string, data?: any) {
        try {
            const subscription = await this.httpService.delete<T>(`${this._env.get('URL_BASE_SAP')}${endPoint}`, {
                headers: {
                    'Cookie': `B1SESSION=${this.SessionId}`
                }
            });
            const result = await firstValueFrom(subscription);
            console.log({result})
            return {data: result.data, status: result.status};
        } catch (error) {
            console.log(endPoint, {error})
            let result = error?.response;
            return {message: result?.message || result?.statusText, status: result.status};
        }
    }
}