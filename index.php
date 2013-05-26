<!DOCTYPE HTML>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<link href="snap.css" type="text/css" rel="stylesheet">
		<title>Snapchat</title>
	</script>
</head>
<body>
	<ul id="snapList">
		<li><div class=header>Received Snapchats</div></li>
	</ul>
	<div id=image>
		<canvas></canvas>
	</div>
	<ul id="friendList">
		<li><div class=header>Friend List</div></li>
	</ul>
	<div id=logout onclick="UI.logout();">
		Logout
	</div>
</body>
<script type="text/javascript" src="snap.js"></script>
<script type="text/javascript">
	UI.login();
</script>
</html>
