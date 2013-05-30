var Drawing = new function() {
	this.penColor = "#F00"; // The color of the pencil
	this.ctx = null; // Canvas context
	this.cpCtx = null; // colorpicker context
	this.drawHistory = []; // History of drawn images

	var pencilElem = document.getElementById("drawingPencil");
	var undoElem = document.getElementById("undoButton");
	var canvas = document.getElementById("drawingCanvas");
	var colorPicker = document.getElementById("colorPicker");
	var inputBar = document.getElementById("drawTextBar");
	var timerInput = document.getElementById("drawingTimer");
	var events = ["mousedown", "mousemove", "mouseup", "touchstart", "touchmove", "touchend"];
	var drawingStarted = false;
	var colorPalette = new Image();

	this.init = function() {
		this.ctx = canvas.getContext('2d');
		this.cpCtx = colorPicker.getContext('2d');
		colorPalette.onload = function() {
			Drawing.cpCtx.drawImage(colorPalette, 0, 0);
			colorPalette = Drawing.cpCtx.getImageData(0,0,1,150);
		};
		colorPalette.src = "assets/color-picker.png";
		timerInput.value = localStorage["snapTime"] || 10;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.addEventListener("click", Drawing.addText, false);
		for (var i = 0; i < events.length; i++)
			colorPicker.addEventListener(events[i], Drawing.pickColor, false);
		this.ctx.strokeStyle = "#F00";
		this.ctx.lineWidth = 3;
		this.ctx.lineCap = "round";
	};

	this.toggleDrawing = function() {
		var display = colorPicker.style.display != "block";
		this.setColor(display ? this.penColor : "#BBB", true);
		colorPicker.style.display = (display ? "block" : "none");
		for (var i = 0; i < events.length; i++) {
			if (display) {
				canvas.addEventListener(events[i], Drawing.draw, false);
				canvas.removeEventListener("click", Drawing.addText);
				this.hideText();
			}
			else {
				canvas.removeEventListener(events[i], Drawing.draw);
				canvas.addEventListener("click", Drawing.addText, false);
			}
		}
	};

	this.hideUndo = function() {
		undoButton.style.display = "none";
	};

	this.setColor = function(color, skipPen) {
		if (typeof(skipPen) == "undefined")
			this.penColor = color;
		pencilElem.style.backgroundColor = color;
		undoElem.style.backgroundColor = color;
		this.ctx.strokeStyle = color;
	};

	this.undoDraw = function() {
		var prev = this.drawHistory.pop();
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (this.drawHistory.length == 0)
			this.hideUndo();
		else
			this.ctx.putImageData(prev, 0, 0);
	};

	this.addDraw = function() {
		if (this.drawHistory.length > 50)
			this.drawHistory.shift();
		this.drawHistory.push(this.ctx.getImageData(0,0, canvas.width, canvas.height));
		undoButton.style.display = "block";
	};

	this.addText = function() {
		inputBar.style.display = "block";
		inputBar.children[0].focus();
	};

	this.hideText = function() {
		if (inputBar.children[0].value == "")
			inputBar.style.display = "none";
		inputBar.children[0].blur();
	};

	this.draw = function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var t = (!touches ? e : touches[0]);
		if (e.type == "touchstart" || e.type == "mousedown") {
			Drawing.addDraw();
			Drawing.ctx.beginPath();
			Drawing.ctx.moveTo(t.clientX, t.clientY);
			drawingStarted = true;
		}
		else if (drawingStarted) {
			Drawing.ctx.lineTo(t.clientX, t.clientY);
			Drawing.ctx.stroke();
		}
		if (e.type == "touchend" || e.type == "mouseup") {
			drawingStarted = false;
		}
	};

	this.pickColor = function(e) {
		if (drawingStarted)
			return;
		e.preventDefault();
		var touches = e.changedTouches;
		var t = (!touches ? e : touches[0]);
		var data = colorPalette.data;
		var o = 4 * (t.clientY - 81);
		var red = data[o];
		if (!red)
			return;
		Drawing.setColor("rgb("+red+","+data[o+1]+","+data[o+2]+")");
	};

	this.createFinalImage = function() {
		if (inputBar.children[0].value != "") {
			this.ctx.fillStyle = "rgb(50,50,50)";
			this.ctx.globalAlpha = .7;
			this.ctx.fillRect(0, inputBar.offsetTop, canvas.width, 32);
			this.ctx.globalAlpha = 1;
			this.ctx.shadowColor = "#000";
			this.ctx.shadowOffsetX = 1;
			this.ctx.shadowOffsetY = 1;
			this.ctx.shadowBlur = 2;
			this.ctx.font = "20px Segoe UI";
			this.ctx.textAlign = "center";
			this.ctx.fillStyle = "#FFF";
			this.ctx.fillText(inputBar.children[0].value, canvas.width/2, inputBar.offsetTop+22)
			inputBar.style.display = "none";
		}
		return canvas.toDataURL("image/jpeg");
	};

	this.getTimer = function() {
		var time = timerInput.value;
		if (localStorage["snapTime"] != time)
			localStorage["snapTime"] = time;
		return time;
	};

	this.saveImage = function() {

	};

	this.send = function() {
		Backend.upload(this.createFinalImage(), 0, ["tehlinuxking"]/*recipients*/, this.getTimer(), function(x) { console.log(x)});
	};
};
