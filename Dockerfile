FROM node:8.16.2-stretch
ADD storage/sources.list /etc/apt/

RUN apt-get update
RUN apt-get install -y git curl mongodb
RUN mkdir -p /var/web
WORKDIR /var/web
RUN git clone https://github.com/superbogy/test-backend.git
WORKDIR /var/web/test-backend
RUN npm i
EXPOSE 6001
ENTRYPOINT ["npm", "run"]
CMD ["start"]