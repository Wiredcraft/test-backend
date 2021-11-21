import path from 'path';
import fs from 'fs';
import morgan from 'morgan';

const logPath = path.join(process.env.LOG_PATH, 'access.log');

const fileLogger = morgan('common', {
  stream: fs.createWriteStream(logPath, { flags: 'a' }),
});

export default fileLogger;
