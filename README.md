# gitmonitor-server

## purpose

The purpose of this app is to remind you to push your code before you shut your macbook and go home, it may be that other people depend on it or your harddrive dies on the way home...

PS: currently it just reports if your repo is not committed, if it is pushed is not checked

## how to install

read 'depends on' first
```
	npm install
	npm run install
```
Terminal1:
```
	npm run up
```

Terminal2:
```
	npm run watch
```

## depends on

* [gitmonitor-client](https://github.com/theotow/gitmonitor-client)
* [gitmonitor-ios](https://github.com/theotow/gitmonitor-ios)
* docker
* node
* docker-compose
* cert.pem and key.pem in app/server/secrets/ please obtain them from apple developer console

## commands

npm run *

* install-package / install package in docker
* install-package / install all deps
* killall / delete all docker created container
* kill / kill node process in docker
* test-local / run tests local
* test / run tests in docker
* watch / start watching for file changes to the backend code in docker
* run / start the dependent docker container in docker
* watch-local / watch tests local
* up / runs the dev build
* up-prod / runs the production build
* build / build the dev build
* build-prod / build the prod build


Tested on Mac OSX 10.10.5 & node 4.2.2 & docker 1.10.0 & docker-compose 1.6.0

## licence

MIT
