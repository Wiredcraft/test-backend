FROM node:17 as base

# bcrypt build dependencies
#RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn install

ADD . /usr/src/app

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -fs http://localhost:$PORT/ping || exit 1
CMD ["npm", "start"]
EXPOSE 3000
