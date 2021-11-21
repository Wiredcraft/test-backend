FROM freeyeti/dev-in-docker:node-16-yarn-2

RUN mkdir /test-backend
WORKDIR /test-backend
COPY . .

RUN yarn install

EXPOSE 80
CMD ["./docker-entrypoint.sh"]