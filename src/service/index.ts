import { App } from '../entry/app';
import { UserService } from './user';

export class Service {
    public user:UserService;
    constructor(public app:App) {
        this.user = new UserService(this.app);
    }
}
