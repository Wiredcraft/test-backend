[![Coverage Status](https://coveralls.io/repos/github/KengoTODA/test-backend/badge.svg?branch=master)](https://coveralls.io/github/KengoTODA/test-backend?branch=master)

## Developers' Note

### Run MongoDB in container

```sh
docker pull mongo:4.4
docker run -it -p 27017:27017 mongo:4.4
```

### Run production build in docker-compose

```sh
docker-compose build
docker-compose up -d
```
