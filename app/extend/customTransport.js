'use strict';

const FileTransport = require('egg-logger').FileTransport;
const moment = require('moment');

class CustomTransport extends FileTransport {
  constructor(options, ctx) {
    super(options);
    this.ctx = ctx;
  }

  log(level, args, meta) {
    const prefixStr = this.buildFormat(level);
    for (let i = 0; i < args.length; i++) {
      if (i === 0) {
        args[i] = `${prefixStr}${args[i]}`;
      }
      if (i === args.length - 1) {
        args[i] += '\n';
      }
    }

    super.log(level, args, meta);
  }

  buildFormat(level) {
    const timeStr = `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}]`;
    const threadNameStr = `[${process.pid}]`;
    const methodStr = `[${this.ctx.request.method}]`;
    const urlStr = `[${this.ctx.request.url}]`;
    const levelStr = `[${level}]`
    return `${timeStr}${threadNameStr}${methodStr}${urlStr}${levelStr}`;
  }

  setUserId(userId) {
    this.userId = userId;
  }
}

module.exports = CustomTransport;
