all: js css

js:
	rm -f snapper-min.js
	rm -f snapper.js
	cat js/random.js >> snapper.js
	cat js/misc.js >> snapper.js
	cat js/drawing.js >> snapper.js
	cat js/ui.js >> snapper.js
	cat js/snapinfo.js >> snapper.js
	cat js/backend.js >> snapper.js
	cat snapper.js | jsmin > snapper-min.js

css:
	rm -f snapper.css
	cat css/main.css >> snapper.css
	cat css/login.css >> snapper.css
	cat css/friends.css >> snapper.css
	cat css/settings.css >> snapper.css
	cat css/snaps.css >> snapper.css
	cat css/camera.css >> snapper.css
	cat css/drawing.css >> snapper.css
