# gitmonitor-server

## purpose

The purpose of this app is to remind you to push your code before you shut your macbook and go home, it may be that other people depend on it or your harddrive dies on the way home...

PS: currently it just reports if your repo is not committed, if it is pushed is not checked

## how to install

## depends on

* gitmonitor-client
* gitmonitor-ios
* docker
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

## licence

MIT
