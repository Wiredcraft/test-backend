# Wiredcraft Back-end Developer Test

This document is to detail how I will complete the backend-developer test.

# Tools

## Database
MongoDB will be used for database support, it's robust, relatively easy to use,
well documented and supported.

## Frameworks
Express will form the core of the application 
Mongoose will be used for database interaction
Mocha and Chai will be used for testing
Embedded Javascript Templates will be used as the template engine

## Environment Variable
Will use the environment variable **.env** to hold information regard test and 
development configuration data.
```
NODE_ENV='dev' 
DEV_APP_PORT=3002                
DEV_DB_HOST='***.***.***.***'
DEV_DB_PORT='27017'                     
DEV_DB_NAME='wired_backend_dev'
TEST_APP_PORT=3000
TEST_DB_HOST='***.***.***.***'
TEST_DB_PORT='27017'
TEST_DB_NAME='wired_backend_test'
DEBUG=btapp
```

