.PHONY: all build clean

all: build

build:
	bun run build
	docker build -t ghcr.io/nicbet/toodle:latest .

clean:
	rm -rf dist/
	docker rmi ghcr.io/nicbet/toodle:latest || true