How to install and test the REST API
====================================

- Git clone the **repo**
- Then **npm install** to install dependencies
- **npm test** to run normal tests
- **npm run test-integration** to run e2e tests
- **npm start** to start the dev server

Testing the APIs Manually
=========================
- 1 You need to authenticate with google Oauth2.0 (your Gmail) before you can do anything with the APIs
- 2 I recommend using this `Postman <https://chrome.google.com/webstore/detail/tabbed-postman-rest-clien/coohjcphdfgbiolnekdpbcijmhambjff?hl=en/>`__
- 3 run the dev server **npm start** then open a new web page goto **http://localhost:3000/api/auth** to authenticate with your google email address
- 4 then goto the **Postman chrome extension** and try the **APIs bellow**

+-------------------------------------+----------------------------------------------------------+
| API Endpoint                        | Description                                              |
+=====================================+==========================================================+
|``/api/auth/logout``                 | remove the cookie session              (GET)             |
+-------------------------------------+----------------------------------------------------------+
|``/api/auth``                        | authenticate with google Oauth2.0      (GET)             |
+-------------------------------------+----------------------------------------------------------+
|``/api/v1/employees``                | get all the employees from the API     (GET)             |
+-------------------------------------+----------------------------------------------------------+
|``/api/v1/employees/{employee_id}``  | get the employee with that Id          (GET)             |
+-------------------------------------+----------------------------------------------------------+
|``/api/v1/employee/{username}``      | get the employee with that username    (GET)             |
+-------------------------------------+----------------------------------------------------------+
|``/api/v1/employees``                | create a new employee                  (POST)            |
+-------------------------------------+----------------------------------------------------------+
|``/api/v1/employees/{employee_id}``  | update the employee with that Id       (PUT)             |
+-------------------------------------+----------------------------------------------------------+
|``/api/v1/employees/{employee_id}``  | delete the employee with that Id       (DELETE)          |
+-------------------------------------+----------------------------------------------------------+
