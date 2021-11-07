FROM node:16-buster as builder
WORKDIR /usr/src/app
COPY asset asset
# copy package.json only to resue layer if no dependencies update
COPY package.json .
RUN npm config set registry https://registry.npmmirror.com && npm install --no-package-lock

COPY src src
COPY tsconfig.json .
RUN npm run build
RUN npm prune --production

# minify image
FROM node:16-alpine
WORKDIR /usr/src/app
COPY asset asset

COPY package.json .
COPY --from=builder /usr/src/app/dist dist
COPY --from=builder /usr/src/app/node_modules node_modules

EXPOSE 9000

CMD ["npm", "run", "prod"]
