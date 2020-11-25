build:
	netlify build

deploy-preview: build
	netlify deploy

deploy: build
	netlify deploy -p
