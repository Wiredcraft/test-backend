const express = require('express')
const app = express()
const port = 3000

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    basePath: '/api/v1',
    info: {
      title: 'Wiredcraft test backend api', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: ['./routes.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

var server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = server;
