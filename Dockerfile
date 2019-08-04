FROM node:10.15.0-alpine

LABEL maintainer="Syed Fahad Saeed"

RUN apk update && apk add openssh vim bash

WORKDIR /tmp

COPY package.json /tmp/

RUN npm install

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN cp -a /tmp/node_modules /usr/src/app/

EXPOSE 8080

CMD ["npm","start"]