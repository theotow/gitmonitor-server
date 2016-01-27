SHELL=/bin/bash
DOCKER=/usr/local/bin/docker

# Configurable variables
DIST=./docker
DOCKER-FILE=Dockerfile
DOCKER-REGISTRY=tutum.co/theotow

DOCKER-REPO-SERVER=gitmonitor-server
DOCKER-REPO-DB=gitmonitor-mongo


build:
	$(DOCKER) build -t=$(DOCKER-REPO-SERVER) -f=docker/app/Dockerfile $(DIST)
	$(DOCKER) build -t=$(DOCKER-REPO-DB) -f=docker/mongo/Dockerfile $(DIST)


push:
	# Assumes docker login
	$(DOCKER) tag -f $(DOCKER-REPO-SERVER) $(DOCKER-REGISTRY)/$(DOCKER-REPO-SERVER)
	$(DOCKER) tag -f $(DOCKER-REPO-DB) $(DOCKER-REGISTRY)/$(DOCKER-REPO-DB)
	$(DOCKER) push $(DOCKER-REGISTRY)/$(DOCKER-REPO-SERVER)
	$(DOCKER) push $(DOCKER-REGISTRY)/$(DOCKER-REPO-DB)
