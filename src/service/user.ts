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
        // need some validator here to check data, should not count on ts only.
        return await this.app.db!.c('user', info);
    };
    public read = async ({id, name}:{
        id?:number,
        name?:string,
    }) => {
        return await this.app.db!.r('user', this.defaultSelects, {id, name});
    };
    public update = async ({id}:{id:number}, info: Partial<PhysicalTable['user']>) => {
        return await this.app.db!.u('user', info, {id});
    };
    public delete = async ({id}:{id:number}) => {
        return await this.app.db!.d('user', {id});
    };
}
