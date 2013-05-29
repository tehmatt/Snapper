js:
	rm -f snapper-min.js
	cat snapper.js | jsmin > snapper-min.js

css:
	rm -f snapper.css
	cat main.css >> snapper.css
	cat login.css >> snapper.css
	cat friends.css >> snapper.css
	cat snaps.css >> snapper.css
	cat camera.css >> snapper.css

all: js css
