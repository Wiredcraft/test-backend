# Backend Developer (Node.js) test

![Typescript-4.6.2](https://img.shields.io/badge/Typescript-4.6.2-blue) ![Node-17.4.0](https://img.shields.io/badge/NodeJS-17.4.0-green) ![Mongo-5.0.6](https://img.shields.io/badge/MongoDB-5.0.6-green)

## How to run

There are a couple ways to run this project. First you can simply build and run on your machine this project like you 
would any other NodeJS program, you can also run it via the Dockerfile or you can run the provided docker-compose to 
run it with its own MongoDB.

Explanations below!

### Running Locally

> A `yarn.lock` being provided in the repository using `yarn` as package manager is recommended, but feel free to use `npm`.

Install the dependencies : 
```bash
yarn install
```

Start the program : 
```bash
yarn start
```

In order to run the project make sure you have a MongoDB to connect to. The config.js will look in the env 
for a `MONGO_URL` and `DATABASE_NAME` to know where to connect, by default they will respectively be
`mongodb://localhost:27017` and `test`. If these don't suit you, and you would want to connect to another URL you can
change the start like so : 
```bash
MONGO_URL=mongodb://something-else:8000 DATABASE_NAME=ASexyDBName yarn start
```

You can also create a `.env` file at the root of the project and set the variables you would like to change (check 
`.env.example` for an example)

### Running via docker

A Dockerfile is provided in this project, to build it make sure you're at the root of the folder, then run the following

```bash
  docker build -t api .
```

The `api` is the name given to the docker image, you can change it as you'd like but if you intend on running mongoDB
through the docker-compose remember to change it there as well.

#### With your own MongoDB

If running the project with your own mongoDB make sure you create a .env folder with the `MONGO_URL` and `DATABASE_NAME` 
matching your environment, then run the follwing

```bash
  docker run -p 3000:3000 --name some-name -d api:latest 
```
`api` is the name given to the docker image in the previous step, if you decided to change it do it here as well.

The `-p` flag will link the a port in the host to a port in the container. If you don't want to run on port `3000`
change the first number to the port you'd rather be using.

#### With dockerized MongoDB

If you want to run with a dockerized mongodb you can run the `docker-compose.yml` provided in the directory. 

```bash 
    docker compose up
```
