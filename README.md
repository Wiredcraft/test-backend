[![Coverage Status](https://coveralls.io/repos/github/KengoTODA/test-backend/badge.svg?branch=master)](https://coveralls.io/github/KengoTODA/test-backend?branch=master)

## Policy to design the service

### Framework and library

- [TypeScript](http://typescriptlang.org/) providing better typing experience
- [NestJS](https://nestjs.com/) used at Wiredcraft
- [MongoDB](https://docs.mongodb.com/) officially supported by NestJS
- [mongoose](https://mongoosejs.com/) reducing boilerplate, and smaller than [TypeORM](https://github.com/typeorm/typeorm)
- [Husky](https://typicode.github.io/husky/#/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/) and [pretty-quick](https://github.com/azz/pretty-quick) to automate development

### Architecture

Apply the four-tier architecture for better maintainability. Nowadays maintainability is most important [software product quality](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010) for team development, to keep the product growing and changing.

See [ARCHTECTURE.md](./ARCHTECTURE.md) for detail.

## Note for developers

To develop and test the product, you need a MongoDB instance listening the `27017` port in local.
You can run it in container, to keep your local env clean:

```sh
docker pull mongo:4.4
docker run -it -p 27017:27017 mongo:4.4
```

To test with production build, use `docker-compose` then it will launch necessary service and config for production:

```sh
docker-compose build
docker-compose up
```
