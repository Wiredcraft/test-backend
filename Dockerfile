FROM node:14

RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY tsconfig.build.json /app
COPY tsconfig.json /app
COPY src /app/src
RUN npm run build

CMD ["npm", "start:prod"]


FROM node:14
RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install --production

COPY --from=0 /app/dist /app
CMD ["node", "/app/main"]
EXPOSE 3000
