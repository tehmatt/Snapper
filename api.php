<?php
require 'snaphax.php';

// For newSnaps
function arr_serialize(&$arr,$pos){$arr = serialize($arr);}
function arr_unserialize(&$arr,$pos){$arr = unserialize($arr);}

session_start();

// Set information if specified, otherwise use session data
$_SESSION['username'] = isset($_POST['username']) ? $_POST['username'] :
   	(isset($_SESSION['username']) ? $_SESSION['username'] : '');

$_SESSION['password'] = isset($_POST['password']) ? $_POST['password'] :
   	(isset($_SESSION['password']) ? $_SESSION['password'] : '');

$call = isset($_GET['call']) ? $_GET['call'] : '';

switch($call){
case 'login':
	if(!empty($_SESSION['username']) && !empty($_SESSION['password'])){
		$opts = array();
		$opts['username'] = $_SESSION['username'];
		$opts['password'] = $_SESSION['password'];
		$opts['debug'] = 0;

		$s = new Snaphax($opts);
		$result = $s->login();
		if (!$result['logged'])
			session_unset();
		else {
			$_SESSION['auth_token'] = $result['auth_token'];
			$_SESSION['snaps'] = $result['snaps'];
		}
		session_regenerate_id();
		echo json_encode($result);
	}
	break;

case 'newSnaps':
	$opts = array();
	$opts['username'] = $_SESSION['username'];
	$opts['password'] = $_SESSION['password'];
	$opts['debug'] = 0;

	$s = new Snaphax($opts);
	$result = $s->login();
	if (!$result['logged'])
		session_unset();
	else {
		$_SESSION['auth_token'] = $result['auth_token'];

		$a = $result['snaps'];
		$b = $_SESSION['snaps'];
		array_walk($a,'arr_serialize');
		array_walk($b,'arr_serialize');
		$newSnaps = array_diff($a,$b);
		array_walk($newSnaps,'arr_unserialize');

		$_SESSION['snaps'] = $result['snaps'];
	}
	echo json_encode($newSnaps);
	break;

case 'getSnap':
	$s = new Snaphax(array(
		'username' => $_SESSION['username'],
		'auth_token' => $_SESSION['auth_token']
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

case 'friend':
	$action = isset($_POST['action']) ? $_POST['action'] : '';
	$friend = isset($_POST['friend']) ? $_POST['friend'] : '';
	$name = isset($_POST['name']) ? $_POST['name'] : '';
	$s = new Snaphax(array(
		'username' => $_SESSION['username'],
		'auth_token' => $_SESSION['auth_token']
	));
	$result = $s->friend($action, $friend, $name);
	echo json_encode($result);
	break;

case 'upload':
	$data = isset($_POST['data']) ? str_replace(' ', '+', $_POST['data']) : '';
	$type = isset($_POST['type']) ? $_POST['type'] : '';
	$recp = isset($_POST['recp']) ? $_POST['recp'] : '';
	$recp = explode(',', $recp);
	$time = isset($_POST['time']) ? $_POST['time'] : '';
	$img_data = base64_decode($data) or die("{\"message\":\"Invalid image.\"}");

	$s = new Snaphax(array(
		'username' => $_SESSION['username'],
		'auth_token' => $_SESSION['auth_token']
	));
	$result = $s->upload($img_data, $type, $recp, $time);
	echo json_encode($result);
	break;

default:
	echo '{"message": "Invalid api call!"}';
	break;
}
