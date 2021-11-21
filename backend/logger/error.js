import path from 'path';
import fs from 'fs';

const logPath = path.join(process.env.LOG_PATH, 'error.log');

export const logErrors = (err, req, res, next) => {
  // Log errors to console, easy to access while this program is running in a container
  // But in the mode of production, we should save logs to somethings like the stack of ELK
  console.error(err);
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  // sending errors in differet conditions
  /*
   * if (err.xxx){
   *   ...
   * }
   */
  res.sendStatus(500).send("Internal error");
};
