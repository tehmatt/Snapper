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
	this.friendAction = function(action, id, name, callback) {
		var req = new XMLHttpRequest();
		var data = "username=" + localStorage["user"] +
			"&action=" + action +
			"&friend=" + id +
			"&name=" + name +
			"&auth_token=" + Snap.getAuth();
		req.open("POST", "http://win8.mbryant.tk/api.php?call=friend", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send(data);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200)
				callback(JSON.parse(req.responseText));
		};
	};
};
