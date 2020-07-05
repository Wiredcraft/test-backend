FROM node:12-alpine as host
LABEL maintainer="Cyril Selasi <cyrilselasi@ymail.com>"

RUN apk add --no-cache --virtual .gyp python make g++

FROM host as base

ENV SERVER_ROOT /usr/src/app
RUN mkdir -p ${SERVER_ROOT}

WORKDIR ${SERVER_ROOT}
COPY . .

RUN yarn install --ignore-optional --link-duplicates --frozen-lockfile
RUN apk del .gyp && rm -rf /var/cache/apk/*

RUN yarn build


# ---------------------------------------------

# Production vendoring stage
FROM host as node_modules

WORKDIR /tmp/
COPY --from=base /usr/src/app/package.json /usr/src/app/yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-optional --production --link-duplicates
RUN apk del .gyp && rm -rf /var/cache/apk/*

# ---------------------------------------------

## Final composition stage
FROM alpine:3 as production
RUN apk add npm && rm -rf /var/cache/apk/*

ENV SERVER_ROOT /usr/src/app

WORKDIR ${SERVER_ROOT}

COPY package.json .

COPY .env .

COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=base ${SERVER_ROOT}/dist ./dist

EXPOSE $APP_PORT
HEALTHCHECK --interval=60s --timeout=120s --retries=3 CMD curl -sS 127.0.0.1:$APP_PORT/healthcheck || exit 1

ENTRYPOINT [ "npm", "run" ]
CMD [ "start:prod" ]
