# User system

## Development setup

### Environment

* Install node.js
    * `nvm` is recommended to manage node version, see [here](https://github.com/nvm-sh/nvm#installing-and-updating) for details.
    * or you can install `node.js` manually [here](https://nodejs.org/en/download/).
    * the specific version we are using, can be found in `./dockerfile`.
* Install git
    * normally it's already installed on Linux/MacOS.
    * Windows users can install from [here](https://git-scm.com/downloads).
* Install docker & docker-compose
    * check details [here](https://docs.docker.com/get-docker/) and [here](https://docs.docker.com/compose/install/).
* Install editor
    * [VSCode](https://code.visualstudio.com/download) is recommended.
    * NOTE: whatever editor you choose, you MUST enable `eslint` plugin.

### Configuration

* create `.env` file, copy from `.env.example`. modify it if nessesary.

### Dependencies

* run `npm i` to install node dependencies.
* run `docker-compose -f local.compose.yml up` to set up database.
    * by default, you can visit [admin panel](http://localhost:9002) to check if the database is working.
    * database configuration is in the `local.compose.yml` file.

## Developing

### Project structure

* `asset` folder contains fixed assets say icon, audio or text.
* `dist` folder contains all compiled files for production.
* `src` folder contains source codes.
    * for interns, in most cases whatever you are asked to write should be here in `router` folder.
* the rest of the files in root are mostly configuration files, DO NOT TOUCH unless you clearly understand what you are doing.

### CLI commands

* run `npm run migrate` to init or update database structure.
* run `npm run dev`, visit [backend health check](http://localhost:9000/ping) to check if everything goes ok.
* run `npm run test` to run tests.
* run `npm run lint` to check code style.
* run `npm run watch` to watch src files change and generate prod files.
* run `npm start` to watch built files and running.
* run `npm run build` to generate prod files.
* run `npm run prod` to start backend in production mode.
* run `docker build -f ./Dockerfile --no-cache -t backend:local .` to build image locally.
* run `docker-compose -f local.test.yml up` to test built image.

Note: for some npm commands, you can add `-h` or `--h` as option to check details how it can be used.
