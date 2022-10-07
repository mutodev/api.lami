import { IResponse } from "../interfaces/responses";

export class Functions {

    static generateRandom() {
        return Math.floor(
            Math.random() * (9999)
        ).toString().padStart(4, '0');
    }

    successResponse<T>(message: string, data: T): IResponse<T> {
        return {status: 'success', message, data} as IResponse<T>;
    }

    warningResponse<T>(message: string, data: T = null): IResponse<T> {
        return {status: 'warning', message, data} as IResponse<T>;
    }

    errorResponse<T>(message: string = ''): IResponse<T> {
        return {status: 'error', message, data: null} as IResponse<T>;
    }

}

export const {successResponse, warningResponse, errorResponse} = new Functions;
