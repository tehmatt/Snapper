all: js css

js:
	rm -f snapper-min.js snapper.js
	cat js/*.js >> snapper.js
	cat snapper.js | jsmin > snapper-min.js

css:
	rm -f snapper.css
	cat css/*.css > snapper.css
