var UI = new function() {
	// Login and set details
	this.login = function(form) {
		if (typeof(form) != "undefined")
			var login = [document.login.elements.username.value, document.login.elements.password.value];
		else
			var login = [localStorage["user"], localStorage["pass"]].filter(function(elem){return elem;});
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
		window.external.notify("login");
	};

	this.drawApp = function() {
		window.external.notify("camera");
		this.displaySection("camera");
	};

	this.displaySection = function(section) {
		var topLevels = document.body.children;
		for (var i = 0; i < topLevels.length; i++)
			topLevels[i].style.display = "none";
		this.initSection(section);
		document.getElementById(section).style.display = "block";
	};

	this.initSection = function(section, displayFunc) {
		switch(section) {
			case "camera":
				this.initCamera();
				break;
			case "drawing":
				Drawing.init();
				break;
			case "friends":
				this.initFriends();
				break;
			case "recipients":
				this.initRecipients();
				break;
			case "settings":
				this.initSettings();
				break;
			case "snapchats":
				this.initSnapchats();
				break;
		}
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
				function() { UI.displaySection("drawing")}, false);
		document.getElementById("settingsLink").addEventListener("click",
				function() {UI.displaySection("settings")}, false);
		document.getElementById("friendsLink").addEventListener("click",
				function() {UI.displaySection("friends")}, false);
	};

	// Fill the friends list
	this.initFriends = function() {
		var allFriends = Snap.getFriends();
		var friends = allFriends.friends.sort(Snap.friendSort);
		var friendList = document.getElementById("friendsAll");
		friendList.innerHTML = "<li id=\"addfriend\" class=\"addFriend\" onclick=\"UI.friendExpand('addFriendElem');\">Add Friend</li> <li id=\"expandaddFriendElem\" class=\"expand\"> Username: <input id=\"newFriendName\" type=\"text\" placeholder=\"Username\"> <div class=\"add friendButton\" onclick=\"UI.friendAction('','add')\">Add Friend</div> </li>";

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
			saveElem.onclick = fn(f.name, "display");
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

	// Fill the friends list
	this.initRecipients = function() {
		var allFriends = Snap.getFriends();
		var friends = allFriends.friends.sort(Snap.friendSort);
		var friendList = document.getElementById("recpAll");
		friendList.innerHTML = "";

		for (var i = 0; i < friends.length; i++) {
			var f = friends[i];
			var friendli = document.createElement("li");
			var display = document.createElement("span");
			display.className = "friend";
			display.innerHTML = (f.display ? f.display : f.name);
			friendli.appendChild(display);
			var name = document.createElement("span");
			name.className = "friendAlt";
			name.innerHTML = (f.display ? f.name : "");
			friendli.appendChild(name);
			var check = document.createElement("input");
			check.className = "recpSelect";
			check.type = "checkbox";
			check.checked = false;
			friendli.appendChild(check);
			friendList.appendChild(friendli);
		}
	};

	this.initSettings = function() {
		var info = Snap.getUserInfo();
		var info = [info.user, info.phone, info.email];
		info[1] = info[1].substring(0,2) + " " + info[1].substring(2,5) + " " + info[1].substring(5,8) + " " + info[1].substring(8,12);
		var accInfo = document.getElementById("account").children;
		for (var i = 0; i < accInfo.length; i++)
			accInfo[i].children[0].innerHTML = info[i];
	};

	// Create the list of snaps
	this.initSnapchats = function() {
		var snaps = Snap.getSnaps();
		var snapList = document.getElementById("snapsAll");
		snapList.innerHTML = "";
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
		var expandElems = document.getElementById("friendsAll").getElementsByClassName("expand");
		for (var i = 0; i < expandElems.length; i++) {
			var elem = expandElems[i];
			elem.style.display = ((elem.id == "expand" + name) && elem.style.display != "block") ? "block" : "none";
		}
	};

	this.friendAction = function(name, action) {
		var actions = ["delete", "display", "add"]
			var action = actions.indexOf(action);
		var newName = (action != 2 ? document.getElementById("text" + name).value
				: document.getElementById("newFriendName").value);
		var setFunc = function(result) {
			if (result.logged) {
				if (action == 0)
					Snap.removeFriend(name);
				else if (action == 1)
					Snap.renameFriend(name, newName);
				else if (action == 2)
					Snap.addFriend(result.object);
			}
			else {
				var errorMsg = (action == 0 ? "deleting" : (action == 1 ? "updating" : "adding"));
				alert("Error " + errorMsg + " friend.");
			}
		};
		switch (action) {
			case 0:
				if(confirm("Are you sure you want to delete "+ name + "?"))
					Backend.friendAction(actions[action], name, "", setFunc);
				break;
			case 1:
				Backend.friendAction(actions[action], name, newName, setFunc);
				break;
			case 2:
				if (Snap.getFriends().friends.every(function(f){return f.name !== newName;}))
					Backend.friendAction(actions[action], newName, "", setFunc);
				else
					alert("You can't add the same friend multiple times!");
				break;
		}
	};

	this.drawSnap = function(id, t) {
		Backend.getSnap(id, function(x){UI.displaySnap(x,t)});
	};

	this.logout = function() {
		if (confirm("Are you sure you want to logout?")) {
			localStorage["user"] = localStorage["pass"] = "";
			location.reload();
		}
	};
};

function displaySection(s) {
	return UI.displaySection(s);
}