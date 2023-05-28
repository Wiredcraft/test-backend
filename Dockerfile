FROM node:18-alpine
LABEL author="Yingjun Cui"
LABEL version="1.0"
LABEL description="Wiredcraft backend test"

WORKDIR /usr/src/app


COPY ./dist ./dist
COPY ./prisma ./prisma
COPY ./public ./public
COPY package.json .
COPY yarn.lock .

RUN yarn install --production=true
RUN yarn prisma generate

ENV PORT=3000
EXPOSE 3000

CMD ["node", "./dist/app.js"]