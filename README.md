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
NODE_ENV=dev 
DEV_APP_PORT=3002                
DEV_DB_HOST=***.***.***.***
DEV_DB_PORT=27017                     
DEV_DB_NAME=wired_backend_dev
TEST_APP_PORT=3000
TEST_DB_HOST=***.***.***.***
TEST_DB_PORT=27017
TEST_DB_NAME=wired_backend_test
DEBUG=btapp
```

# User Model
Field(s):
* id*: type String
* name: type String required
* dob: type: Date required
* address: type: String
* description: type: String
* createdAt: type: Date

*Note:* id is a string that is generated from the MongoDB created id.

*Note 2:* make a unique index to help prevent duplicate entries. 
Fields used are 
* name
* dob
* address

# Testing

With the use of Mocha and Chai a number of test suites have been created to test a number of 
features. These suites are as follows:

* **basic_user_test.js**: This suite tests the basic CRUD actions on the database directly. Making 
sure a user can be added, retrieved and deleted. Also it tests that a duplicate user cannot be added.
* **dac_test.js**: This group of tests basically checks that the data access controller is performing CRUD 
actions to expectations.
* **route_test.js**: This group of tests basically checks that the routing is working as expected and data 
is being handled as exepected.

# Controllers
Will use two controllers to interface the data with the frontend whatever that may be.
* **data_access_controller**: responsible for retrieving and storing data in the database.
* **routing_controller**: responsible for getting data to the router for presentation.

# Hold everything, it's all been changed
Well not really, but now there needs to be a way to send data as an api request and a way do display on 
the frontend via a web interface. To the end instead of using one router, there will be two **api_router.js**
and **web_router.js** to respond to an api or webpage request respectively.


