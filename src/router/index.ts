import http from 'http';
import { Logger } from 'log4js';
import { App } from '../entry/app';
import { installUser } from './user';
import fs from 'fs';
import path from 'path';
import { installLogin } from './login';
import { installCallback } from './callback';
import url from 'url';
import { parse } from 'querystring';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
}

export type RouterHandlerResult = {
    err?: Error,
    statusCode?: number,
    data?: any,
} | undefined | void;
export type Handler = (req:http.IncomingMessage, res:http.ServerResponse, body?:any) => Promise<RouterHandlerResult>;

const parseBody = async (req:http.IncomingMessage, limitSize?:number):Promise<unknown> => {
    const MAX_BODY_SIZE = limitSize || 10 * 1024 * 1024;
    return await new Promise((resolve, reject) => {
        const chunks:string[] = [];
        let dataSize = 0;
        req.on('data', (chunk) => {
            chunks.push(chunk);
            dataSize += chunk.toString().length;
            if (dataSize > MAX_BODY_SIZE) {
                reject(413);
            }
        });
        req.on('end', () => {
            resolve(JSON.parse(chunks.concat().toString()));
        });
        req.on('error', (e) => {
            console.error(e);
            reject(500);
        });

    });
};

function getIPs(req:http.IncomingMessage) : string[] {
    const ip = req.socket.remoteAddress;
    const xfwd = req.headers['X-Forwarded-For'];
    if (xfwd === undefined || xfwd.length === 0) {
        if (ip === undefined) {
            throw new Error(`Could not get IP for request`);
        }
        return [ip];
    }
    if (Array.isArray(xfwd)) {
        throw new Error(`Got array when retrieving X-Forwarded-For headers`);
    }
    const fwdIPs = xfwd.split(',').map((s) => s.trim());
    if (fwdIPs.length === 0) {
        if (ip === undefined) {
            throw new Error(`Could not get IP for request`);
        }
        return [ip];
    }
    return fwdIPs;
};

export const parseUrl = (reqUrl:string, route:string) => {
    return parse(url.parse(reqUrl.substr(route.length + 1)).query!);
}

export class Router {
    public routes:{
        method:HttpMethod,
        pattern:string|RegExp,
        handler:(req:http.IncomingMessage, res:http.ServerResponse) => Promise<any>,
    }[] = [];
    public logger:Logger;
    constructor(public app:App) {
        this.logger = this.app.loggers.getLogger('Router');
        this.logger.level = this.app.config.logLevel;
    }
    public getIP(req:http.IncomingMessage) : string {
        const ips = getIPs(req);
        return ips[ips.length - 1];
    };
    public route = async (
        method:HttpMethod,
        name:string|RegExp,
        ...handlers:Handler[]
    ):Promise<void> => {
        this.routes.push({
            method,
            pattern: name,
            handler: async (req, res) => {
                let body;
                try {
                    body = method !== HttpMethod.GET ? parseBody(req) : undefined;
                } catch (e) {
                    this.logger.warn(`Parse body failed`);
                    res.statusCode = e;
                    res.end();
                    return;
                }
                let result:RouterHandlerResult;
                try {
                    res.statusCode = 200;
                    for (let i = 0; i < handlers.length; i++) {
                        result = await handlers[i](req, res, body);
                        if (result && result.err) {
                            break;
                        }
                    }
                    if (result) {
                        const { err, data, statusCode } = result;
                        // known error mostly here;
                        if (err) {
                            res.statusCode = statusCode || 500;
                            this.logger.warn(err);
                            res.end(err.message || 'Internal Error');
                        } else {
                            if (statusCode) {
                                res.statusCode = statusCode;
                            }
                            res.setHeader('content-type', 'application/json; charset=utf-8')
                            res.end(JSON.stringify(data));
                        }
                    } else {
                        if (res && res.destroyed === false) {
                            res.end();
                        }
                    }
                } catch (e) {
                    // unknow error, should log and go fix;
                    this.logger.error(e);
                    res.end(e ? e.message : JSON.stringify(e));
                }
            },
        });
    }
}

export const getHttpHandler = async (router:Router):Promise<(req:http.IncomingMessage, res:http.ServerResponse) => Promise<void>> => {
    router.route(HttpMethod.GET, '/ping', async (_, res) => {
        res.end('pong');
    });
    const buffer = await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, '..', '..', 'asset', 'favicon.ico'), (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
    router.route(HttpMethod.GET, '/favicon.ico', async (_, res) => {
        res.end(buffer);
    });
    
    await installUser(router);
    await installLogin(router);
    await installCallback(router);

    const httpHandler = async (req:http.IncomingMessage, res:http.ServerResponse):Promise<void> => {
        // ideally, i would perfer to new an object that contains req, res and an unique requestId for each request, to trace error stack.
        router.logger.info(`Incoming request ${req.url}`);
        for (const route of router.routes) {
            if ((typeof route.pattern === 'string' ?
                route.pattern === req.url :
                (route.pattern as RegExp).test(req.url!)) && route.method === req.method
            ) {
                try {
                    await route.handler(req, res);
                } catch (e) {
                    router.logger.error(`unhandled error`, e);
                } finally {
                    return;
                }
            }
        }
        router.logger.warn(`No matching route ${req.url} ${req.method}`);
        res.statusCode = 400;
        res.end('No matchhing route');
    };
    return httpHandler;
};
