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

function nodeListToArr(nodeList) {
	var nodes = [];
	for (var i = nodeList.length; i--; nodes.unshift(nodeList[i]));
	return nodes;
}

function initdrawing(image) {
	Drawing.init(image);
}
