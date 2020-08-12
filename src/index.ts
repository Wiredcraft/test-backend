import {LoggingBindings} from '@loopback/extension-logging';
import {ApplicationConfig, TestBackendApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new TestBackendApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  // configure Logs
  app.configure(LoggingBindings.COMPONENT).to({
    enableFluent: false,
    enableHttpAccessLog: true,
  })
  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      basePath: '/api/v1',
      requestBodyParser: {json: {limit: '1mb'}},
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
