FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:5.13.0-alpine

WORKDIR /app
COPY ["package.json", "./"]
COPY ["package-lock.json", "./"]
RUN npm i
COPY . .
RUN npm run build

CMD ["npm", "start:prod"]
