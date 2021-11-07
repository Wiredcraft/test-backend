import { App } from '../entry/app';
import { OauthService } from './oauth';
import { OauthGithubService } from './oauth_github';
import { RequestService } from './request';
import { SessionService } from './session';
import { UserService } from './user';

export class Service {
    public user:UserService;
    public request:RequestService;
    public oauth:OauthService;
    public session:SessionService;
    public oauthGithub:OauthGithubService;
    constructor(public app:App) {
        this.user = new UserService(this.app);
        this.request = new RequestService(this.app);
        this.oauth = new OauthService(this.app);
        this.session = new SessionService(this.app);
        this.oauthGithub = new OauthGithubService(this.app);
    }
}
