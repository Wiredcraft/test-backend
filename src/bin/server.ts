import { config } from '../config';
import { app } from '../app';

export const main = () => {
  app.listen(config.port);
  console.log(`${config.appName} is listening on port ${config.port}`);
};

main();

