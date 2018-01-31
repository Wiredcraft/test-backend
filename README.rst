How to install and test the REST API
====================================

- Git clone the `repo` or fetch the `PR`
- Then `npm install` to install dependencies
- `npm test` to run test cases
- `npm start` to start the dev server

Testing the APIs
================
I recommend using this `Postman <https://chrome.google.com/webstore/detail/tabbed-postman-rest-clien/coohjcphdfgbiolnekdpbcijmhambjff?hl=en/>`__
- 1 run the dev server `npm start` then open a new web page goto `http://localhost:3000/api/auth` to authenticate with your google email address
- 2 then goto the `Postman chrome extension` and try the `APIs bellow`

+-------------------------------------+----------------------------------------------------------+
| API Endpoint                        | Description                                              |
+=====================================+==========================================================+
| ``/api/auth/logout``                | remove the cookie session              (GET)             |
+-------------------------------------+----------------------------------------------------------+
| ``/api/auth``                       | authenticate with google Oauth2.0      (GET)             |
+-------------------------------------+----------------------------------------------------------+
| ``/api/v1/employees``               | get all the employees from the API     (GET)             |
+-------------------------------------+----------------------------------------------------------+
| ``/api/v1/employee_id``             | get the employee with that Id          (GET)             |
+-------------------------------------+----------------------------------------------------------+
| ``/api/v1/employees/employee_name`` | get the employee with that username    (GET)             |
+-------------------------------------+----------------------------------------------------------+
| ``/api/v1/employee``                | create a new employee                  (POST)            |
+-------------------------------------+----------------------------------------------------------+
| ``/api/v1/employee_id``             | update the employee with that Id       (PUT)             |
+-------------------------------------+----------------------------------------------------------+
| ``/api/v1/employee_id``             | delete the employee with that Id       (DELETE)          |
+-------------------------------------+----------------------------------------------------------+


Wiredcraft Back-end Developer Test
==================================

Make sure you read **all** of this document carefully, and follow the guidelines in it.

Content
-------

Build a RESTful API that can `get/create/update/delete` user data from a persistence database

User Model
==========

```
{
  "id": "xxx",                  // user ID (you can use uuid or the ID provided by database, but need to be unique)
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
}
```

Requirements
============

Functionality
=============

- The API should follow typical RESTful API design pattern.
- The data should be saved in the DB.
- Provide proper API document.

Tech stack
==========

- Use Node.js and any framework.
- Use any DB. NoSQL DB is preferred.

Bonus
=====

- Write clear **documentation** on how it's designed and how to run the code.
- Provide proper unit test.
- Write good commit messages.
- An online demo is always welcome.

Advanced requirements
=====================

These are used for some further challenges. You can safely skip them if you are not asked to do any, but feel free to try out.

- Use [Seneca](http://senecajs.org/) to build the core feature and use a different framework (such as Express or Loopback) to handle HTTP requests.
- Provide a complete user auth (authentication/authorization/etc) strategy, such as OAuth.
- Provide a complete logging (when/how/etc) strategy.
- Use a NoSQL DB and build a filter feature that can filter records with some of the attributes such as username. Do not use query languages such as MongoDB Query or Couchbase N1QL.

What We Care About
------------------

Feel free to use any libraries you would use if this were a real production App, but remember we're interested in your code & the way you solve the problem, not how well you can use a particular library.

We're interested in your method and how you approach the problem just as much as we're interested in the end result.

Here's what you should aim for:

- Good use of current Node.js & API design best practices.
- Solid testing approach.
- Extensible code.

Q&A
===

> Where should I send back the result when I'm done?

Fork this repo and send us a pull request when you think you are done. We don't have a deadline for the task.

> What if I have a question?

Create a new issue in the repo and we will get back to you very quickly.
