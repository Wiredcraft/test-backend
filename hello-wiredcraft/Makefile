env:=dev
MONGO_CONTAINER_NAME:=mongodb-wiredcraft

start-dbs:
	docker pull mongo:latest
	docker run --name $(MONGO_CONTAINER_NAME) -p 27017:27017 -d mongo:latest

stop-dbs:
	docker rm -f $(MONGO_CONTAINER_NAME)

fetch-env:
	cp ./environments/${env}.env ./.env
