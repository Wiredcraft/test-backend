#### How to run

`npm start` will start an HTTP server listening on `localhost:8000`. A mongodb server will need to be running on `localhost:27107` (this can be adjusted in the file `src/config.js`). There is also a prefix on all routes `/api/v1` so all routes are as follows:

- POST `localhost:8000/api/v1/user` creates a user
- GET `localhost:8000/api/v1/user/:id` reads a user 
- DELETE `localhost:8000/api/v1/user/:id` deletes a user 
- POST `localhost:8000/api/v1/user/:id` updates a user 

Tests can be run via `npm test`

You can also use [apidoc](http://apidocjs.com) (`npm install -g apidoc`) to generate some nicer documentation with expected parameters etc `apidoc -i src/`.
