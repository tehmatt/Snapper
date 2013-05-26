<?php
require 'snaphax.php';
$call = isset($_GET['call']) ? $_GET['call'] : '';
switch($call){
case 'login':
	$username = isset($_POST['username']) ? $_POST['username'] : '';
	$password = isset($_POST['password']) ? $_POST['password'] : '';

	if(!empty($username) && !empty($password)){
		$opts = array();
		$opts['username'] = $username;
		$opts['password'] = $password;
		$opts['debug'] = 0;

		$s = new Snaphax($opts);
		$result = $s->login();
		echo json_encode($result);
	}
	break;
case 'getSnap':
	$username = isset($_POST['username']) ? $_POST['username'] : '';
	$auth_token = isset($_POST['auth_token']) ? $_POST['auth_token'] : '';
	$s = new Snaphax(array(
		'username' => $username,
		'auth_token' => $auth_token
	));
	$id = isset($_POST['id']) ? $_POST['id'] : false;
	if($id){
		$blob_data = $s->fetch($id);
		if($blob_data){
			ob_clean();
			$imageData = base64_encode($blob_data);
			echo 'data: image/jpeg;base64,'.$imageData;
			ob_end_flush();
		}
	}
	break;
case 'sendSnap':
	echo '{}';
	break;
default:
	echo '{"message": "Invalid api call!"}';
	break;
}
