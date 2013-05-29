var Drawing = new function() {
	// The color of the pencil
	this.penColor = "#F00";

	var pencilElem = document.getElementById("drawingPencil");
	var colorPickerElem = document.getElementById("colorPicker");
	var canvas = document.getElementById("drawingCanvas");
	var ctx = context = canvas.getContext('2d');
	var drawingStarted = false;

	this.init = function() {
		canvas.width = document.innerWidth;
		canvas.height = document.innerHeight;
		canvas.addEventListener('mousedown', Drawing.draw, false);
		canvas.addEventListener('mousemove', Drawing.draw, false);
		canvas.addEventListener('mouseup',   Drawing.draw, false);
		ctx.strokeStyle = "#F00";
		ctx.lineWidth = 3;
	};

	this.toggleColorPicker = function() {
		colorPickerElem.style.display = (colorPickerElem.style.display != "block" ? "block" : "none");
	};

	this.setColor = function(color) {
		pencilElem.style.backgroundColor = color;
		ctx.strokeStyle = color;
	};

	this.draw = function(e) {
		console.log(e.type, e.clientX, e.clientY, drawingStarted);
		if (e.type == "mousedown") {
			ctx.beginPath();
			ctx.moveTo(e.clientX, e.clientY);
			drawingStarted = true;
		}
		else if (e.type == "mouseup") {
			drawingStarted = false;
		}
		else if (e.type == "mousemove") {
			if (drawingStarted) {
				console.log("drawing!");
				ctx.lineTo(e.clientX, e.clientY);
				ctx.stroke();
			}
		}
	};
};
