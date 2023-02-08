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

    calculateEstimateDate(today: Date, totalStock: number, isEspecial: boolean) {
        if (totalStock <= 0 && !isEspecial) {
            let days = 15;
            return new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, 12);
          } else if (totalStock > 0 && !isEspecial) {
            let days = 3;
            return new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, 12);              
          } else if (isEspecial) {
            let days = 30;
            return new Date(today.getFullYear(), today.getMonth(), today.getDate() + days, 12); 
          }
    }

}

export const {successResponse, warningResponse, errorResponse, calculateEstimateDate} = new Functions;
