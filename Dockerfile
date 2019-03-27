FROM node:alpine

RUN npm install pm2 -g
RUN npm install nodemon -g
RUN npm install yarn -g

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile
ADD . /app

CMD ["yarn", "docker:start"]
