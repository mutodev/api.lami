/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { PaginateFunction, PaginateOptions } from './pagination-types';

@Injectable()
export class PaginationService {

    constructor(private _env: EasyconfigService) {}

      createPaginator(defaultOptions: PaginateOptions): PaginateFunction {
        return async (model, args: any = { where: undefined }, options) => {
          const page = Number(options?.page || defaultOptions?.page) || 1
          const perPage = Number(options?.perPage || defaultOptions?.perPage || this._env.get('PER_PAGE')) || 10
          
          const skip = page > 0 ? perPage * (page - 1) : 0
          const [total, data] = await Promise.all([
            model.count({ where: args.where }),
            model.findMany({
              ...args,
              take: perPage,
              skip,
            }),
          ])
          const lastPage = Math.ceil(total / perPage)
      
          return {            
            total: total,
            currentPage: page,
            perPage,
            lastPage,
            prev: page > 1 ? page - 1 : null,
            next: page < lastPage ? page + 1 : null, 
            data           
          }
        }
      }

}
