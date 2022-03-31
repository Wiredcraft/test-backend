FROM node:17 as base

# bcrypt build dependencies
#RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn install

ADD . /usr/src/app

CMD ["yarn", "start"]
EXPOSE 3000
