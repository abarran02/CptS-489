FROM node:alpine

VOLUME ["/app"]

WORKDIR /app

RUN npm install -g npm@latest

CMD ["node", "app.js"]
