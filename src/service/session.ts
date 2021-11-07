import { App } from '../entry/app';
import http from 'http';
import * as Cookie from 'cookie';
import crypto from 'crypto';
import { RouterHandlerResult } from '../router';

function expireSeconds(expireAt:Date) : number {
    return Math.floor((expireAt.getTime() - Date.now()) / 1000);
}
export class SessionService {
    private cookieName = 'backend';
    constructor(private app:App) {
    }
    private sessionKey = (session:string) => {
        return `backend:user:session:${session}`;
    }
    private sha256Encode = (data:string, salt:string) => {
        return crypto.createHash('sha256').update(data + salt).digest('hex');
    }
    private sessionEncode = (userId:string) => {
        return this.sha256Encode(userId, this.app.config!.sessionCiperKey);
    }
    private getDefaultExpire () {
        return new Date(Date.now() + this.app.config.sessionExpire * 1000);
    }
    private getExpireDate () {
        return new Date(Date.now() - this.app.config.sessionExpire * 1000);
    }
    private parseCookie = (req:http.IncomingMessage|string) : {[cookieName:string]:string} => {
        if (typeof req === 'string') {
            return Cookie.parse(req);
        }
        if (!req.headers || !req.headers.cookie) {
            return {};
        }
        return Cookie.parse(req.headers.cookie);
    }
    private setCookie = (req:http.IncomingMessage, res:http.ServerResponse, cookieName:string, cookieValue:string, expireAt:Date) => {
        const { origin } = req.headers;
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Set-Cookie', Cookie.serialize(cookieName, cookieValue, {
            httpOnly: true,
            expires: expireAt,
            path: '/',
            sameSite: typeof origin === 'string' && origin.startsWith('https') ? 'none' : undefined,
            secure: typeof origin === 'string' && origin.startsWith('https') ? true : undefined,
        }));
    }

    public checkAuth = async (req:http.IncomingMessage):Promise<RouterHandlerResult> => {
        const cookie = this.parseCookie(req);
        const sessionId = cookie[this.cookieName];
        if (sessionId === undefined) {
            return {
                err: new Error('unauthoried'),
                statusCode: 401,
            }
        }
        const userId = await this.app.redis!.get(this.sessionKey(sessionId));
        if (!userId) {
            return {
                err: new Error('unauthoried'),
                statusCode: 401,
            }
        }
    }
    public getUserId = async (req:http.IncomingMessage):Promise<number> => {
        const cookie = this.parseCookie(req);
        const sessionId = cookie[this.cookieName];
        if (sessionId === undefined) {
            throw new Error('unauthoried');
        }
        const userId = await this.app.redis!.get(this.sessionKey(sessionId));
        if (!userId) {
            throw new Error('unauthoried');
        }
        return Number(userId);
    }
    public setAuth = async (req:http.IncomingMessage, res:http.ServerResponse, id:number) => {
        const sessionId = this.sessionEncode(String(id));
        const expireAt = this.getDefaultExpire();
        this.setCookie(req, res, this.cookieName, sessionId, expireAt);
        await this.app.redis!.setex(this.sessionKey(sessionId), expireSeconds(expireAt), String(id));

    }
    public expireAuth = async (req:http.IncomingMessage, res:http.ServerResponse) => {
        const cookies = this.parseCookie(req);
        const sessionId = cookies[this.cookieName];
        sessionId && await this.app.redis!.del(this.sessionKey(sessionId));
        this.setCookie(req, res, this.cookieName, sessionId, this.getExpireDate());
    }
    public expireAuthByAdmin = async (userId:number) => {
        const sessionId = this.sessionEncode(String(userId));
        await this.app.redis!.del(this.sessionKey(sessionId));
    }
}
