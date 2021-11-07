import { App } from '../entry/app';
import http from 'http';
import https from 'https';
import { Logger } from 'log4js';

export class RequestService {
    private logger:Logger;
    constructor(private app: App) {
        this.logger = this.app.loggers.getLogger('Request');
        this.logger.level = 'info';
    }

    public req = async (targetUrl: string, method = 'GET', headers?: http.OutgoingHttpHeaders) => {
        this.logger.info('Requesting:', targetUrl);
        try {
            return await new Promise<string>((resolve, reject) => {
                const httx = targetUrl.startsWith('https') ? https : http;
                try {
                    httx.request(encodeURI(targetUrl), { method, headers }, (res) => {
                        const chunkList: any[] = [];
                        res.on('error', (e) => {
                            reject(e);
                        });
                        res.on('data', (chunk) => {
                            chunkList.push(chunk);
                        });
                        res.on('end', () => {
                            resolve(Buffer.concat(chunkList).toString());
                        });
                    }).on('error', (e) => {
                        reject(e);
                    }).end();
                } catch (e) {
                    reject(e);
                }
            })
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}
