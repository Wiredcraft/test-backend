FROM node:alpine

MAINTAINER Erignoux Laurent <lerignoux@gmail.com>

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install

CMD ["npm", "run", "start"]
