FROM node:21-alpine3.18

VOLUME ["/app"]

WORKDIR /app

RUN npm install -g npm@latest
