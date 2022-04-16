/**
 * This module defines how the Swagger UI should be generated from the JSDoc.
 *
 * Getting Started with Swagger JSDoc:
 *   - https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md
 * Getting Started with Swagger Specification:
 *   - https://editor.swagger.io/
 */
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const package = require('../package.json');

module.exports = function (app) {
    const swaggerSpec = swaggerJSDoc({
        swaggerDefinition: {
            info: {
                title: package.name,
                version: package.version,
                description: package.description,
            },
        },
        apis: ['./swagger.yaml']
    });

    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
