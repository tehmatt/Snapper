// Random Number class
var Random = new function () {
	// Return an int within [min, max]
	this.nextInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	// Return a float within [min, max]
	this.nextFloat = function(min, max) {
		return Math.random() * (max - min + 1) + min;
	};
	// Return a bool with p probability of being true
	this.nextBool = function(p) {
		return Math.random() < p;
	};
};

var UI = new function() {
	// Login and set details
	this.login = function(form) {
		if (typeof(form) != "undefined")
			var login = [document.login.elements.username.value, document.login.elements.password.value];
		else
			var login = [localStorage["user"], localStorage["pass"]].filter(function(elem){return elem});
		if (login.length != 2) {
			this.displayLogin();
			return;
		}
		var loginDetails = Backend.login(login[0], login[1]);
		if (loginDetails == null || !loginDetails.logged)
			this.displayLogin("Invalid Credentials");
		else {
			document.getElementById("login").style.display = "none";
			Snap.setLogin(loginDetails);
			this.drawApp();
		};
	};

	// Display a login form in document.body with id=loginForm
	this.displayLogin = function(msg) {
		if (typeof(msg) != "undefined") {
			var message = document.getElementById("loginMessage");
			message.style.display = "block";
			message.innerHTML = msg;
		}
		document.getElementById("loginPass").value = "";
		document.getElementById("login").style.display = "block";
	};

	this.drawApp = function() {
		document.getElementById("application").style.display = "block";
		this.displayFriends();
		this.displaySnaps();
	};

	// Fill the friends list
	this.displayFriends = function() {
		var friends = Snap.getFriends();
		var friendList = document.getElementById("friendList");
		for (var i = 0; i < friends.length; i++) {
			friendList.insertAdjacentHTML("beforeend",
				"<li><span class=friend>"+(friends[i].display ? friends[i].display : "Unknown")+"</span>" +
				"<span class=friendAlt>("+friends[i].name+")</span></li>"
			);
		}
	};

	this.displaySnaps = function() {
		var snaps = Snap.getSnaps();
		var snapList = document.getElementById("snapList");
		for (var i = 0; i < snaps.length; i++) {
			if (snaps[i].sn == null)
				continue;
			snapList.insertAdjacentHTML("beforeend",
				"<li class=" + (snaps[i].st != 1 ? "viewed" :"''") +
				" onclick=\"UI.drawSnap('"+snaps[i].id+"');\">" +
				"<span class=sendPerson>" + snaps[i].sn + "</span>" +
				"<span class=receiveTime>" + (new Date(snaps[i].ts)) + "</span></li>"
			);
		}
	};

	this.drawSnap = function(id) {
		Backend.getSnap(id, UI.drawImage);
	};

	this.drawImage = function(uri) {
		var ctx = document.getElementById('image').getElementsByTagName("canvas")[0].getContext('2d');
		var img = new Image;
		img.onload = function(){
			ctx.canvas.width = img.width;
			ctx.canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
		};
		img.src = uri;
	};
	this.logout = function() {
		localStorage.clear();
		location.reload();
	};
};

var Snap = new function() {
	// Snapchat login data saved here
	this.info = {};

	this.setLogin = function(info) {
		this.info = info;
	};
	this.getUserInfo = function() {
		return {user: this.info.username, phone: this.info.snapchat_phone_number};
	};
	this.getFriends = function() {
		return this.info.friends;
	};
	this.getSnaps = function() {
		return this.info.snaps;
	};
};

var Backend = new function() {
	// Do a login call
	this.login = function(user, pass) {
		var req = new XMLHttpRequest();
		req.open("POST", "http://win8.mbryant.tk/api.php?call=login", false);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send("username="+user+"&password="+pass);
		try {
			var result = JSON.parse(req.responseText);
			if (result.logged) {
				localStorage["user"] = user;
				localStorage["pass"] = pass;
			}
			return result;
		}
		catch(err) {
			return null;
		}
	};
	this.getSnap = function(id, callback) {
		var req = new XMLHttpRequest();
		req.open("POST", "http://win8.mbryant.tk/api.php?call=getSnap", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send("username="+localStorage["user"]+"&id="+id+"&auth_token="+Snap.info.auth_token);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200)
				callback(req.responseText);
		};
	};
};
