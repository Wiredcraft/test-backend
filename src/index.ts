import http from 'http';
import app from './app';
import { IAddressInfo } from './types';

const { PORT, APP_HOST, APP_PORT } = process.env;

// get app port
const port = PORT || APP_PORT || app.context.config.get('App.port') || 3031;

// handle server loding error
const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
  case 'EADDRINUSE':
    console.error('server loading error:', `${port} is already use`);
    process.exit(1);
  default:
    throw error;
  }
};

// create server
export default app.listen(port, () => {
  const sp = `${APP_HOST}:${port}`;
  console.log(`server is running on http://${sp}`);
  // tell the user document path
  if (process.env.NODE_ENV === 'development') {
    console.log(`you can get the API document from http://${sp}/index.html`);
  }
}).on('error', onError);

