<?php
require 'snaphax.php';

$call = isset($_GET['call']) ? $_GET['call'] : '';
$username = isset($_POST['username']) ? $_POST['username'] : '';
$auth_token = isset($_POST['auth_token']) ? $_POST['auth_token'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

switch($call){
case 'login':
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
case 'friend':
	$action = isset($_POST['action']) ? $_POST['action'] : '';
	$friend = isset($_POST['friend']) ? $_POST['friend'] : '';
	$name = isset($_POST['name']) ? $_POST['name'] : '';
	$s = new Snaphax(array(
		'username' => $username,
		'auth_token' => $auth_token
	));
	$result = $s->friend($action, $friend, $name);
	echo json_encode($result);
	break;
case 'upload':
	$data = isset($_POST['data']) ? $_POST['data'] : '';
	$type = isset($_POST['type']) ? $_POST['type'] : '';
	$recp = isset($_POST['recp']) ? $_POST['recp'] : '';
	$time = isset($_POST['time']) ? $_POST['time'] : '';

	$s = new Snaphax(array(
		'username' => $username,
		'auth_token' => $auth_token
	));
	$result = $s->upload($jpg_data, $type, $recp, $time);
	echo json_encode($result);
	break;
default:
	echo '{"message": "Invalid api call!"}';
	break;
}
