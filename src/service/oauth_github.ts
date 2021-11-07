import { PhysicalTable } from '../db/schema';
import { App } from '../entry/app';

export class OauthGithubService {
    private defaultSelects: (keyof PhysicalTable['oauth_github'])[] = [
        'id',
        'user_id',
        'node_id',
    ];
    constructor(private app:App) {
    }
    public create = async (info: Partial<PhysicalTable['oauth_github']>) => {
        return await this.app.db!.c('oauth_github', info);
    };
    public read = async (filter:{
        user_id?:number,
        node_id?:string,
    }) => {
        return await this.app.db!.r('oauth_github', this.defaultSelects, filter);
    };
    public update = async (filter:{id:number}, info: Partial<PhysicalTable['oauth_github']>) => {
        return await this.app.db!.u('oauth_github', info, filter);
    };
    public delete = async (filter:{id:number}) => {
        return await this.app.db!.d('oauth_github', filter);
    };
}
