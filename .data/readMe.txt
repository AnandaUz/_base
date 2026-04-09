
Инициация саб модуля для _base

git submodule add https://github.com/AnandaUz/_base.git

npm run build:server
docker build -t liner-test .
docker run --rm liner-test

docker run -it liner-test sh


npm install --save-dev tsc-alias
