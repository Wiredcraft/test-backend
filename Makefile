ifeq (, $(shell which yarn))
$(error "This project makes use of Yarn, please install yarn on your local system")
endif

all:
	@echo "\nStarting Dependent Services"
	docker-compose -f docker-compose.yml up -d database
	@echo "\nInstalling Yarn Dependencies"
	yarn install --frozen-lockfile
	yarn run start:watch

shutdown:
	@echo "\Stopping Docker Services"
	docker-compose down

clean:
	make shutdown

start:
	yarn run docker:build
	yarn run docker:run

