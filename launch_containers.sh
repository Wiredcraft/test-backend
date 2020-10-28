# spin up mongodb database
sudo docker-compose -f mongo.docker-compose.yml up --build -d mongodb

# spin up redis
sudo docker-compose -f redis.docker-compose.yml up -d