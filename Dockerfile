FROM node:9.4.0-slim
MAINTAINER Ray Wong<pivstone@gmail.com>
EXPOSE 1357
ENV NODE_ENV=production
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
