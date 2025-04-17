import { ApiListResponse, Api } from './base/api'
import { IItem, IOrderDetails, IOrderResult } from './../types';

export interface IProjectApi {
    getItemList: () => Promise<IItem[]>;
    orderPlaced: (order: IOrderDetails) => Promise<IOrderResult>;
}

export class ProjectApi extends Api implements IProjectApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    };

    getItemList(): Promise<IItem[]> {
        return this.get('/product')
        .then((data: ApiListResponse<IItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    };

    orderPlaced(order: IOrderDetails): Promise<IOrderResult> {
        return this.post(`/order`, order)
        .then((data: IOrderResult) => data);
    };
}