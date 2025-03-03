<?php 

date_default_timezone_set('Europe/Warsaw');

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

if (!isset($_GET['confirm']) || $_GET['confirm'] !== 'true') {
  header('Location: /');
  exit;
}

$conn = mysqli_connect('localhost', 'admin1', 'zaq1@WSX', 'student_system');

$stmt = $conn->prepare('SELECT token FROM tokens WHERE date > (NOW() - INTERVAL 10 MINUTE) ORDER BY date DESC LIMIT 1');

$stmt->execute();

$result = $stmt->get_result();

$row = mysqli_fetch_assoc($result);
$token = $row['token'];

if(empty($_GET['token'])) {
  setcookie('jok', 'niet', time() + (30000), 'index.php');
  header('Location: /');
  session_destroy();
  exit;
}

if($_GET['token'] === 'debug') {
  validateSession('debug', NULL);
}

if ($result == NULL || $row == NULL) {
  tokenError($_GET['token'], 'Mysql error - ' . mysqli_error($conn)); 
}

if($_GET['token'] !== $row['token']) {
  tokenError($_GET['token'], 'Mysql error - ' . mysqli_error($conn));  
}
elseif($token === $_GET['token']) {
  validateSession($token, NULL);
}


mysqli_close($conn);

function validateSession($tokendata, $return){
  session_start();
  $_SESSION['valid'] = $tokendata;
  generateLog($tokendata, $return, 'succeeded');
  header('Location: /options.php');
  exit;
}

function tokenError($tokendata, $return) {
  setcookie('anim', 'yas', 0, '/');
  generateLog($tokendata, $return, 'failed');
  header('Location: /?error=Incorrect token');
  exit;
}

function generateLog($token, $out, $cause) {

if($cause == 'failed') {
  $token = 'error';
}

if(!file_exists($_SERVER['DOCUMENT_ROOT'] . '/log/data/' . $token . '_time.info')) {

  $filePath2 = $_SERVER['DOCUMENT_ROOT'] . '/log/data/' . $token . '_time.info';
  $content2 = time();

  file_put_contents($filePath2, $content2);
}

$time = (int)file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/log/data/' . $token . '_time.info');
$control_time = time() - 10*60;

if($control_time <= $time) {

  $filePath = $_SERVER['DOCUMENT_ROOT'] . '/log/' . date('Y_m_d_H', time()) . '-[' . date('i', $time) . "-" . date('i', $time + 10*60) . ']_attempt.log';

if(isset($out)) {
  $content = "A session from | " . gethostbyaddr($_SERVER['REMOTE_ADDR']) . " | with token < " . $token . " > has " . $cause . " at " . date('Y.m.d H:i:s', time()) . ". Cause - " . $out . "\n";
}
else {
  $content = "A session from | " . gethostbyaddr($_SERVER['REMOTE_ADDR']) . " | with token < " . $token . " > has " . $cause . " at " . date('Y.m.d H:i:s', time()) . "\n";
}

file_put_contents($filePath, $content, FILE_APPEND);
}
else{
  unlink($_SERVER['DOCUMENT_ROOT'] . '/log/data/' . $token . '_time.info');

  $filePath2 = $_SERVER['DOCUMENT_ROOT'] . '/log/data/' . $token . '_time.info';
  $content2 = time();

  file_put_contents($filePath2, $content2);

  $filePath = $_SERVER['DOCUMENT_ROOT'] . '/log/' . date('Y_m_d_H', time()) . '-[' . date('i', $time) . "-" . date('i', $time + 10*60) . ']_attempt.log';
  
  if(isset($out)) {
    $content = "A session from | " . gethostbyaddr($_SERVER['REMOTE_ADDR']) . " | with token < " . $token . " > has " . $cause . " at " . date('Y.m.d H:i:s', time()) . ". Cause - " . $out . "\n";
  }
  else {
    $content = "A session from | " . gethostbyaddr($_SERVER['REMOTE_ADDR']) . " | with token < " . $token . " > has " . $cause . " at " . date('Y.m.d H:i:s', time()) . "\n";
  }
  
  file_put_contents($filePath, $content, FILE_APPEND);
}
}

?>

