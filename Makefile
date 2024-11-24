install:
	npm ci

lint:
	npx eslint .

dev:
	npx webpack serve

build-prod:
	rm -rf dist
	NODE_ENV=production npx webpack