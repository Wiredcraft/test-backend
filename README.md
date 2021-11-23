# test-backend

## development

### Requirements:

* Docker installed
* A terminal tool based on `bash` or `zsh`

### To develop:

1. `./dev backend` to start and `enter` the container of development

* Next commands are only available in the container

1. `yarn install` to install dependences
1. `yarn init-db` to initialize the database, and to import some mock daata
1. `yarn test` to run tests
1. `yarn dev` to start a development server which implemented by nodemon
1. `yarn start` to start a non-reload server (for staging)

### To access

* Dev-site: `http://localhost:3000/` 
* API-docs: `http://localhost:3000/docs/`

### To recycle the resources of development:

1. `./dev down` : this command can drop all the development containers, don't worry, all data are persistent
1. If you try to prune all the data and code, just `delete` the directory of this project.

[Read more](./docs/about-dev.md)

## Staging

### Requirements:

* Docker installed
* A terminal tool based on `bash` or `zsh`
* Local port of 3000 is free (able to change in the `docker/docker-compose.yml`)

### Playing with staging

`./dev up-staging`, (wating for all services started) then the service will served on `http://localhost:3000`

Using `./dev down-staging` to remove containers.

### To build a fresh image

`./dev build`

## Explaining

Here is a comprehensive description of this program

[Click here to learn more](./docs/design.md)

## Task response

### Features

* [√] The API should follow a typical RESTful API design pattern.
* [√] The data should be saved in the DB.
* [√] Provide proper unit test.
* [√] Provide proper API document.

### Tech stack

* [√] Use Node.js and any framework.
* [√] Use any DB. NoSQL DB is preferred.

* Addition: Docker and shell
