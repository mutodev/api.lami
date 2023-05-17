import { IResponse } from "../interfaces/responses";
let ejs = require("ejs");
let pdf = require("html-pdf");
const { join, resolve } = require('path');

export interface OptionPDF {
    height?: string;
    width?: string;
    headerHeight?: string;
    footerHeight?: string;
}

export class Functions {

    static generateRandom() {
        return Math.floor(
            Math.random() * (9999)
        ).toString().padStart(4, '0');
    }

    successResponse<T>(message: string, data: T): IResponse<T> {
        return { status: 'success', message, data } as IResponse<T>;
    }

    warningResponse<T>(message: string, data: T = null): IResponse<T> {
        return { status: 'warning', message, data } as IResponse<T>;
    }

    errorResponse<T>(message: string = ''): IResponse<T> {
        return { status: 'error', message, data: null } as IResponse<T>;
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

    async createPdf(template: string, data, option: OptionPDF = {}) {
        const result = await new Promise<any>((resolve, reject) => {
            ejs.renderFile(template, { data }, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
        // console.log('result', result)
        let options = {
            "height": option.height || "11.25in",
            "width": option.width || "8.5in",
            "header": {
                "height": option.headerHeight || "5mm"
            },
            "footer": {
                "height": option.footerHeight || "6mm",
            },
        };
        const buffer = await new Promise<Buffer>((resolve, reject) => {
            pdf.create(result, options).toBuffer(function (err, buffer) {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });
        return buffer;
    }

}

export const { successResponse, warningResponse, errorResponse, calculateEstimateDate, createPdf } = new Functions;
