DOCKER-COMPOSE := docker-compose -f docker-compose.yml

.PHONY: $(MAKECMDGOALS)

env-up:
	@ echo "start MySQL"
	@ $(DOCKER-COMPOSE) up -d
	@ until docker exec wiredcraft_db_1 mysql -h 127.0.0.1 -P 3306 -u user -ppassword -e 'select 1' >/dev/null 2>&1; do sleep 1; echo "checker-test: Waiting for MySQL to come up..."; done;
	@ docker exec wiredcraft_db_1 mysql -h 127.0.0.1 -P 3306 -u root -ppassword -e "GRANT SELECT, INSERT, UPDATE, DELETE, RELOAD, SUPER, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'user'@'%';"
	@ echo "MySQL starts"

server-up:
	@ ./mvnw spring-boot:run

clean-data:
	@ $(DOCKER-COMPOSE) rm -vsf || true
	@ docker volume prune -f
