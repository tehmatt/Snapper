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

// Return the time since start in Snapchat format
function timePassed(start) {
	var start = new Date(start);
	var now = new Date();
	var pass = new Date(now.getTime() - start.getTime());
	var months = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];
	if (pass.getUTCFullYear() > 1970 || pass.getUTCMonth() > 0 || pass.getUTCDate() > 7)
		return months[start.getUTCMonth()] + " " + start.getUTCDate() + ", "+ start.getUTCFullYear();
	if (pass.getUTCDate() > 1)
		return (pass.getUTCDate() == 2 ? "1 day ago" : (pass.getUTCDate()-1) + " days ago");
	if (pass.getUTCHours() > 0)
		return (pass.getUTCHours() == 1 ? "1 hour ago" : pass.getUTCHours() + " hours ago");
	if (pass.getUTCMinutes() > 0)
		return (pass.getUTCMinutes() == 1 ? "1 minute ago" : pass.getUTCMinutes() + " minutes ago");
	return (pass.getSeconds() == 1 ? "1 second ago" : pass.getUTCSeconds() + " seconds ago");
}

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
		this.initCamera();
		this.initFriends();
		this.initSnaps();
		this.displaySection("camera");
	};

	this.displaySection = function(section) {
		var topLevels = document.body.children;
		for (var i = 0; i < topLevels.length; i++)
			topLevels[i].style.display = "none";
		document.getElementById(section).style.display = "block";
	};

	this.displaySnap = function(uri, time) {
		var div = document.getElementById('displaySnap');
		var img = new Image;
		img.onload = function(){
			UI.displaySection("displaySnap");
			div.children[0].innerHTML = time;
			var timeLeft = setInterval(function() {
				time--;
				div.children[0].innerHTML = time;
			}, 1000);
			setTimeout(function() {
				clearInterval(timeLeft);
				UI.displaySection("snapchats");
				div.removeChild(img);
			}, time*1000);
		};
		img.src = uri;
		div.appendChild(img);
	};

	this.initCamera = function() {
		document.getElementById("snapsLink").addEventListener("click",
				function() {UI.displaySection("snapchats")}, false);
		document.getElementById("captureImage").addEventListener("click",
				function() {alert("Picture taken");}, false);
		document.getElementById("settingsLink").addEventListener("click",
				function() {UI.displaySection("settings")}, false);
		document.getElementById("friendsLink").addEventListener("click",
				function() {UI.displaySection("friends")}, false);
		document.getElementById("logout").addEventListener("click", UI.logout, false);
	};

	// Fill the friends list
	this.initFriends = function() {
		var allFriends = Snap.getFriends();
		var friends = allFriends.friends.sort(Snap.friendSort);
		var friendList = document.getElementById("friendsAll");
		friendList.innerHTML = "";
		for (var i = 0; i < friends.length; i++) {
			var f = friends[i];
			var friendli = document.createElement("li");
			var fn = function(x) { return function() { UI.friendExpand(x); }; };
			friendli.onclick = fn(f.name);
			var display = document.createElement("span");
			display.className = "friend";
			display.innerHTML = (f.display ? f.display : f.name);
			friendli.appendChild(display);
			if (f.display) {
				var name = document.createElement("span");
				name.className = "friendAlt";
				name.innerHTML = f.name;
				friendli.appendChild(name);
			}
			var li = document.createElement("li");
			li.id = "expand" + f.name;
			li.className = "expand";
			li.innerHTML = "Edit Name:";
			var edit = document.createElement("input");
			edit.id = "text" + f.name;
			edit.type = "text";
			edit.value = (f.display ? f.display : "");
			edit.placeholder = "Name";
			var saveElem = document.createElement("div");
			var fn = function(x,y) { return function() { UI.friendAction(x,y); }; };
			saveElem.onclick = fn(f.name, "save");
			saveElem.className = "save friendButton";
			saveElem.innerHTML = "Save Changes";
			var deleteElem = document.createElement("div");
			deleteElem.onclick = fn(f.name, "delete");
			deleteElem.className = "delete friendButton";
			deleteElem.innerHTML = "Delete";
			li.appendChild(edit);
			li.appendChild(saveElem);
			li.appendChild(deleteElem);
			friendList.appendChild(friendli);
			friendList.appendChild(li);
		}
	};

	// Create the list of snaps
	this.initSnaps = function() {
		var snaps = Snap.getSnaps();
		var snapList = document.getElementById("snapsAll");
		for (var i = 0; i < snaps.length; i++) {
			var s = snaps[i];
			var view = Snap.getView(s);
			snapList.insertAdjacentHTML("beforeend",
					"<li class=\"" + view + "\"" +
					(view === "received-image-closed" ? " onclick=\"UI.drawSnap('"+s.id+"',"+s.t+");\">" : ">") +
					"<div class=sendPerson>" + (s.sn ? s.sn : s.rp) + "</div>" +
					"<div class=receiveTime>" + timePassed(s.ts) + Snap.getAction(s) + "</div></li>"
					);
		}
	};

	this.friendExpand = function(name) {
		var allFriends = Snap.getFriends();
		var friends = allFriends.friends.sort(Snap.friendSort);
		for (var i = 0; i < friends.length; i++) {
			var f = friends[i];
			document.getElementById("expand" + f.name).style.display = ((f.name === name && document.getElementById("expand" + f.name).style.display != "block") ? "block" : "none");
		}
	};

	this.friendAction = function(name, action) {
		var save = (action === "save");
		var newName = document.getElementById("text" + name).value;
		var setFunc = function(set) {
			if (set) {
				if (save)
					Snap.renameFriend(name, newName);
				else
					Snap.removeFriend(name);
				UI.initFriends();
			}
			else
				alert("Error " + (save ? "saving data." : "deleteing friend."));
		};
		if (save)
			Backend.friendAction(name, newName, setFunc);
		else if (confirm("Are you sure you want to delete "+ name + "?"))
			Backend.friendAction(name, "", setFunc);
	};

	this.drawSnap = function(id, t) {
		Backend.getSnap(id, function(x){UI.displaySnap(x,t)});
	};

	this.logout = function() {
		if (confirm("Are you sure you want to logout?")) {
			localStorage.clear();
			location.reload();
		}
	};
};

var Snap = new function() {
	// Snapchat login data saved here
	this.info = {};

	this.setLogin = function(info) {
		this.info = info;
	};
	this.getAuth = function() {
		return this.info.auth_token;
	};
	this.getUserInfo = function() {
		return {user: this.info.username, phone: this.info.snapchat_phone_number};
	};
	this.getFriends = function() {
		return {friends: this.info.friends.filter(function(elem){return elem.name !== Snap.getUserInfo().user;}),
			best: this.info.bests, recent: this.info.recents};
	};
	this.renameFriend = function(name, newName) {
		this.info.friends.filter(function(e){return e.name === name;})[0].display = newName;
	}
	this.removeFriend = function(name) {
		this.info.friends = this.info.friends.filter(function(e){return e.name !== name;});
	};
	this.getSnaps = function() {
		return this.info.snaps;
	};
	this.friendSort = function(a,b) {
		a = (a.display ? a.display : a.name).toLowerCase();
		b = (b.display ? b.display : b.name).toLowerCase();
		return a < b ? -1 : (a > b ? 1 : 0);
	};
	this.getView = function(snap) {
		var view = "";
		if (snap.m == 3)
			return "friend-request";
		if (snap.sn) {
			view += "received-";
			if (snap.m == 0)
				view += "image-";
			else if (snap.m == 1)
				view += "video-";
		}
		else if (snap.rp)
			view += "sent-";
		if (snap.st == 1)
			view += "closed";
		else if (snap.st == 3 && snap.rp)
			view += "screenshot";
		else
			view += "open";
		return view;
	};
	this.getAction = function(snap) {
		switch(this.getView(snap)) {
			case "friend-request":
				return " - Added you";
			case "sent-closed":
				return " - Delivered";
			case "sent-open":
				return " - Opened";
			case "sent-screenshot":
				return " - Took a Screenshot!";
			case "received-image-open":
			case "received-video-open":
				return " - Viewed";
			case "received-image-closed":
				return " - Unopened";
			case "received-video-closed":
				return " - Unwatched";
			default:
				return "";
		}
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

	// Get snap image from id
	this.getSnap = function(id, callback) {
		var req = new XMLHttpRequest();
		req.open("POST", "http://win8.mbryant.tk/api.php?call=getSnap", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send("username="+localStorage["user"]+"&id="+id+"&auth_token="+Snap.getAuth());
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200)
				callback(req.responseText);
		};
	};

	// Rename friend id to name if name is not null, else delete friend
	this.friendAction = function(id, name, callback) {
		var req = new XMLHttpRequest();
		var data = "username=" + localStorage["user"] +
			"&friend=" + id +
			"&name=" + name +
			"&auth_token=" + Snap.getAuth();
		req.open("POST", "http://win8.mbryant.tk/api.php?call=friend", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send(data);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200)
				callback(req.responseText);
		};
	};

};
