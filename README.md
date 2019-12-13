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

Now that there are two routers, one for the api and another for the web view, trying to use one controller has
gotten a little unruly. I can tell becuse my tests are misbehaving with the slightest change.  So a little talk
about the web view then back to the controllers.

# Web view
Originally the plan was to have at least 3 pages. A Listing page, a profile detail page and an edit page. This plan
was scrapped for one page that lists the users in a table, when a user in the table is clicked on the details come 
up in a profile div, and the update/adding of a user is handled by a form on the lower portion of the page.

One problem that came up with having a web view and an API is that the API will handle data submission using JSON 
while the web view can putter along with submitting form data. Thus at this point it may be prudent to go with two
separate controllers.

# Authentication

Now Authentication will be added. Some say this should have been done first and maybe they're right, however the
attempt here was to get the basis functionality working first. Also, adding an oAuth autehntication is not a trivial
task; so another branch was created.

Trying to implement OAuth2 but running into a number of unexpected issues. Did discover a logger called Winston
which I will try to implement before turning over my code.

As for the OAuth code that was starting to be implemented I want to give credit to this [this article I read](https://aleksandrov.ws/2013/09/12/restful-api-with-nodejs-plus-mongodb/)
regarding implementing OAuth2.

In an unsuccessful the effort to implement OAuth2, basic authentication has been implemented with Passport.

The User model has been changed as it was creating a conflict between users of the sysetm (which had been temporarily renamed to drones) and 
the data in the system. Now the User model is called Person. The current Users model is set up to work with Passport and apears as follows:

# User Model
Field(s):
* username: type String required
* password: type: String required
* salt: type: String
 
# Set up and run

So I continue to use env variables to have some of the configuration. You can see it again here:
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
*Note*: I had issues when putting strings in quotes.

# Setting up
Clone into a directory, afterwards you should run npm install in project root, then run mongod, node ./libs/dataGen.js (wait for completion), and then npm start.

the dataGen.js will popluate the database with some Persons and create a User.

# Running the tests
The test can be run from the main folder with the command npm test

The front end works as one would expect, there is a login, an informational screen and a logout. The API can be accessed by prefixing the route with **/api**


# Using the API

**Retrieveing the list of Persons**: GET http://127.0.0.1:3000/api/user/list : Retrieve all the person information in the database.

**Selecting one Person**: GET http://127.0.0.1:3000/api/user/:personId : Retrive exactly one person from the database
* personId: String

**Creating a Person**: POST http://127.0.0.1:3000/api/user/enroll : Insert a Person into the database
* JSON object
```
{
"name": Sring,
 "dob" : Date,
 "address": String,
 "description": String
 }
 ```
 The **name, dob, and address** fields are required as they form the unique key to identify one user from another (the odds of
 having two people with the exact same name, address and date of birth are fairly slim).
 
 **Updating a Person**: POST http://127.0.0.1:3000/api/user/enroll : Update a Person in the database
 * Two element JSON object
```
{"criteria": {"id" : String},
 "data":  {JSON Object of the field names and values you want to update}
 }
 
 EX.
 { "criteria" :{
                id": "5df2eacde78180653f79e5d5"
                },
   "data" :    { 
                "description": "Vulcan first officer and Ambassador to Romulus"
                }
 }
 ```
 Currently, an attempt to update more than one person simultaneously whould produce and error.
 
 **Removing a Person**: POST http://127.0.0.1:3000/api/user/remove : Delete a Person from the database
 * param JSON
 ```
 {"id": String}
 ```
 
 Oddly enough as I write this document, I'm realizing I put in no methods for retrieving batches of users based on some 
 criteria. I will correct that oversight now. Back in 20 minutes.
 
# Post mortem

I hope I have the basics down, as I eventually got sucked into a black hole of Passport and OAuth2. Honestly this has been my first encouter with OAuth2 with NodeJs.
I'm also a bit disappointed that I couldn't get to the distance calculator, since I already have th formula to find the distance between two coordinates. 
Some takeaways:

* Stop using the environment variable for so much configuration information, start using a key.js file instead
* OAuth2 will be implemented even if it isn't in time for this presentation
* Naming conventions are important, having to change model names and all the references is not a fun task to do when you have a few hours to go
* It was fun and I really enjoyed doing this project. I did learn a bit. 
* Working alone is no fun.

# Thank you for your time and consideration 


