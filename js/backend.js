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

	this.fetchNewSnaps = function(callback) {
		var req = new XMLHttpRequest();
		req.open("POST", "http://win8.mbryant.tk/api.php?call=newSnaps", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send();
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				try {
					callback(JSON.parse(req.responseText));
				}
				catch (err) {
					console.log(err);
					UI.login();
				}
			}
		};
	};

	// Get snap image from id
	this.getSnap = function(id, callback) {
		var req = new XMLHttpRequest();
		req.open("POST", "http://win8.mbryant.tk/api.php?call=getSnap", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send("id="+id);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200)
				callback(req.responseText);
		};
	};

	// Rename friend id to name if name is not null, else delete friend
	this.friendAction = function(action, id, name, callback) {
		var req = new XMLHttpRequest();
		var data = "action=" + action +
			"&friend=" + id +
			"&name=" + name;
		req.open("POST", "http://win8.mbryant.tk/api.php?call=friend", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send(data);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200)
				callback(JSON.parse(req.responseText));
		};
	};

	this.upload = function(data, type, recipients, time) {
		var req = new XMLHttpRequest();
		var data = "type=" + type +
			"&recp=" + recipients +
			"&time=" + time +
			"&data=" + data;
		req.open("POST", "http://win8.mbryant.tk/api.php?call=upload", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send(data);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				try {
					JSON.parse(req.responseText);
				}
				catch(e) {
					alert("Failure sending snap!");
				}
			}
		};
	};
};
