# CptS-489

## Docker Usage
Requires (Docker)[https://www.docker.com/] installed. From the root directory, run:
```bash
docker build -t hunter .
docker run --rm -v /path/to/app:/app hunter npm install
```
With the image built, the container can be run with:
```bash
docker run --init --rm -v /path/to/app:/app hunter -p 3000:3000 hunter node app.js
```
