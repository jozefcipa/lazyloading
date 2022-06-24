install:
	npm install

serve:
# -c-1 => disable caching for demonstrational purposes
	./node_modules/.bin/http-server -c-1 ./example/

generate:
	node bin/generate-previews.js inputDir=$(inputDir) outputDir=$(outputDir)