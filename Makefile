.PHONY: all build clean build_local clean_local

all: build

build:
	docker build -t ghcr.io/nicbet/toodle:latest .

clean:
	docker rmi ghcr.io/nicbet/toodle:latest || true

build_local:
	bun install --frozen-lockfile && bun run build

clean_local:
	rm -rf dist/

deploy:
	docker push ghcr.io/nicbet/toodle:latest
