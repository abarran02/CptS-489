# CptS-489

HunterGather is a web application using Node, Express, and EJS to showcase dynamic content generation and rendering. HunterGather streamlines cooking by integrating recipe discovery, shopping list ordering, and vendor inventory management, enhancing the cooking experience for enthusiasts, creators, and merchants alike.

## Usage
Install the project dependencies using [npm](https://www.npmjs.com/):
```bash
npm install
```
Generate the default database:
```bash
node database/generate.js
```
Then run the web server:
```bash
npm start
```

## Docker Usage
Development environment requires [Docker](https://www.docker.com/) installed. From the root directory, run:
```bash
docker build -t hunter .
docker run --rm -v $PWD:/app hunter npm install
```
With the image built, the container can be run with:
```bash
docker run --init --rm -v $PWD:/app -p 3000:3000 hunter node app.js
```
