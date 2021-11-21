import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API document for test-backend',
    version: '0.0.1',
    contact: {
      name: 'Jack Li',
      url: 'https://jianxuan.li',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  // This path should related to app.js which in the root of project
  apis: ['./backend/routers/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);