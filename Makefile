# Toodle Makefile
REGISTRY ?= ghcr.io
OWNER = nicbet
IMAGE = toodle
TAG = $(REGISTRY)/$(OWNER)/$(IMAGE)
BASETAG = $(REGISTRY)/$(OWNER)/$(IMAGE)-base
GIT_SHA ?= $(shell git rev-list --max-count=1 --abbrev-commit HEAD)
VERSION ?= $(GIT_SHA)
GHCR_IO_USER ?= anonymous
GHCR_IO_PAT ?= unknown

.PHONY: all build clean build_local clean_local login-registry logout-registry tag-version push-image pull-image tag-latest

all: build

build:
	docker build -t ghcr.io/nicbet/toodle:latest .

clean:
	docker rmi ghcr.io/nicbet/toodle:latest || true

build_local:
	bun install --frozen-lockfile && bun run build

clean_local:
	rm -rf dist/

deploy: login-registry push-image logout-registry

# Login to Docker registry
login-registry:
	$(info Login to $(REGISTRY))
	@docker login $(REGISTRY) -u $(GHCR_IO_USER) -p $(GHCR_IO_PAT)

# Logout from Docker registry
logout-registry:
	$(info Logout from $(REGISTRY))
	@docker logout $(REGISTRY)

tag-version:
	$(info Tagging $(TAG):$(GIT_SHA) as $(TAG):$(VERSION))
	@docker tag $(TAG):$(GIT_SHA) $(TAG):$(VERSION)

# Deploy the image to Docker registry
push-image:
	$(info Deploying image with tag $(TAG):$(VERSION))
	@docker push $(TAG):$(VERSION)

# Fetch the image from Docker registry (requires `docker login` for private repositories)
pull-image:
	$(info Pulling image with tag $(TAG):$(VERSION))
	@docker pull $(TAG):$(VERSION)

tag-latest:
	$(info Tagging image with tag $(TAG):$(VERSION) as latest)
	@docker tag $(TAG):$(VERSION) $(TAG):latest

push-latest:
	$(info Pushing $(TAG):latest)
	@docker push $(TAG):latest
