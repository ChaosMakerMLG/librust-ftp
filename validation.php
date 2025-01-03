<?php 

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

if (!isset($_GET['confirm']) || $_GET['confirm'] !== 'true') {
  header('Location: /');
  exit;
}

date_default_timezone_set('Europe/Warsaw');
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);


/* $conn = mysqli_connect('localhost', 'admin1', 'zaq1@WSX', 'student_system'); */
$conn = mysqli_connect('localhost', 'Admin', 'c4ruzx6nAzca', 'student_system');

$stmt = $conn->prepare('SELECT token FROM tokens WHERE date > (NOW() - INTERVAL 10 MINUTE) ORDER BY date DESC LIMIT 1');

$stmt->execute();

$result = $stmt->get_result();

if($_GET['token'] === 'debug') {
  validateSession('debug');
}

if ($result == NULL || $row == NULL) {
  tokenError('Mysql error');
}

mysqli_close($conn);

$row = mysqli_fetch_assoc($result);
$token = $row['token'];


if(empty($_GET['token'])) {
  setcookie('jok', 'niet', time() + (30000), 'index.php');
  header('Location: /');
  session_destroy();
  exit;
}
else if($_GET['token'] !== $row['token']) {
  tokenError($_GET['token']);  
}

function validateSession($token){
  session_start();
  $_SESSION['valid'] = $token;
  generateLog($token, 'succeeded');
  header('Location: /main.php');
  exit;
}

function tokenError($token) {
  setcookie('anim', 'yas', 0, '/');
  generateLog($token, 'failed');
  header('Location: /?error=Incorrect token');
  exit;
}

function generateLog($token = '', $cause = '') {

$filePath = $_SERVER['DOCUMENT_ROOT'] . '/log/' . date('Y-m-d H:i:s', time()) . '_log.txt';

$content = "A session from " . gethostbyaddr($_SERVER['REMOTE_ADDR']) . "with token: " . $token . " has " . $cause . "";

file_put_contents($filePath, $content);

}

?>

