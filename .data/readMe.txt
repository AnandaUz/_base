
Инициация саб модуля для _base

git submodule add https://github.com/AnandaUz/_base.git

npm run build:server
docker build -t liner-test .
docker run --rm liner-test

docker run -it liner-test sh


как импотировать правильно - поддерживается на уровне Ноде
Node.js Subpath Imports: 

создание симлинка
New-Item -Path "D:\_sites\test\server\base" -ItemType SymbolicLink -Target "D:\_sites\test\_base\base_server"
