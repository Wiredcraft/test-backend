module.exports["swagger-generator"] = {
    swaggerJsonPath:  "./assets/swagger.json",
    swagger: {
        swagger: '2.0',
        info: {
            title: 'test-backend',
            description: 'This is a generated swagger json for test-backend project',
            contact: {name: 'pivstone', url: 'http://github.com/pivstone', email: 'pivstone@ymail.com'},
            version: '1.0.0'
        },
        host: 'localhost:1337',
        basePath: '/',
        externalDocs: {url: 'http://github.com/pivstone'}
    }
}
