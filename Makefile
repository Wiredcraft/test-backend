env:
ifeq (,$(wildcard ./.env))
	cp .env.example .env
else
	echo ".env file present"
endif

build:
	docker-compose build

run:
	docker-compose up -d

watch:
	docker-compose up

.PHONY: env build run watch
