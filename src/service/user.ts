import { PhysicalTable } from '../db/schema';
import { App } from '../entry/app';

export class UserService {
    private defaultSelects: (keyof PhysicalTable['user'])[] = [
        'id',
        'name',
        'address',
        'created_at',
        'dob',
        'description',
    ];
    constructor(private app:App) {
    }
    public create = async (info: Partial<PhysicalTable['user']>) => {
        return await this.app.db!.c('user', info);
    }
    public read = async (filter:{
        id?:number,
        name?:string,
    }) => {
        return await this.app.db!.r('user', this.defaultSelects, filter);
    }
    public update = async (filter:{id:number}, info: Partial<PhysicalTable['user']>) => {
        return await this.app.db!.u('user', info, filter);
    }
    public delete = async (filter:{id:number}) => {
        return await this.app.db!.d('user', filter);
    }
}
