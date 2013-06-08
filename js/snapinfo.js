var Snap = new function() {
	// Snapchat login data saved here
	this.info = {};
	this.updateInterval = null;

	this.setLogin = function(info) {
		this.info = info;
		if (!this.updateInterval)
			this.updateInterval = setInterval(Snap.update, 10000);
	};
	this.getAuth = function() {
		return this.info.auth_token;
	};
	this.getUserInfo = function() {
		return {user: this.info.username, phone: this.info.mobile, email: this.info.email};
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
	this.addFriend = function(friend) {
		this.info.friends.push(friend);
	};
	this.getSnaps = function() {
		return this.info.snaps;
	};
	this.getSenderById = function(id) {
		return Snap.getSnaps().filter(function(x){return x.id == id;})[0].sn;
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
	this.update = function() {
		var oldSnaps = Snap.getSnaps().filter(function(x){return x.sn;}).map(function(x){return x.id;});
		Snap.setLogin(Backend.login(localStorage["user"], localStorage["pass"]));
		var newSnaps = Snap.getSnaps().filter(function(x){return x.sn;}).map(function(x){return x.id;});
		var newSnaps = newSnaps.filter(function(x){return oldSnaps.indexOf(x) == -1;}).map(Snap.getSenderById);
		if (newSnaps.length)
			Snap.newNotify(newSnaps);
	};
	this.newNotify = function(newSnaps) {
		window.external.notify("notifications:"+newSnaps.join());
	};
};
