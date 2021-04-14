// Swagger set up
export const swaggerOptions = (apiVersion) => {
  return {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'REST API for Wiredcraft Test',
        version: `${apiVersion}`,
        description:
          'REST API for Wiredcraft Test',
        license: {
          name: 'ISC',
          url: 'https://choosealicense.com/licenses/isc/'
        },
        contact: {
          name: 'Seth',
          email: 'yupengx@hotmail.com'
        }
      },
      servers: [
        {
          url: `http://localhost:3000/${apiVersion}/`,
          description: 'Local server for Dev',
        }
      ]
    },
    apis: ['src/routes/users.js', 'src/models/User.js'],
  };
};
