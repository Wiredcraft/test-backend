import FileTimestampStream from "file-timestamp-stream";
import strftime from "ultra-strftime";
import config from './config';
import {
    join
} from 'path';
import cluster from 'cluster';

const {
    trackingLogDir,
    logFileInterval = 20
} = config;

let pid = "master";
if (!cluster.isMaster) {
    if (process.env.NODE_APP_INSTANCE) {
        //使用pm2提供的id,重启不会变化
        pid = "w" + process.env.NODE_APP_INSTANCE;
    } else {
        pid = "w" + process.pid;
    }
}

class MyFileTimestampStream extends FileTimestampStream {
    newFilename() {
        let gapMinute = Math.floor(new Date().getMinutes() / logFileInterval) * logFileInterval;
        if (gapMinute < 10) {
            gapMinute = "0" + gapMinute;
        }
        const filename = strftime(this.path);
        return join(trackingLogDir, `${filename}${gapMinute}.log`);
    }
}

const gapStr = new Buffer([7]);

const streams = {};

export function getLogger(name) {
    if (!streams[name]) {
        streams[name] = new MyFileTimestampStream({
            path: name + `-${pid}_%Y-%m-%d-%H-`,
        });
    }
    return function (info) {
        let header = [new Date().toISOString()];
        let line = header.concat(info);
        streams[name].write(line.join(gapStr) + "\n");
    }
}