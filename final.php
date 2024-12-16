<?php 

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

session_start();

if(empty($_SESSION['valid'])) {
  header('location:/');
  exit;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/css/final.css" rel="stylesheet"/>
    <script src="/scripts/script.js"></script>
    <script src="https://code.jquery.com/jquery-2.1.4.js"></script>
    <title>Document</title>
</head>
<body>
<div id="loading" class="container">
    <div class="dash uno"></div>
      <div class="dash dos"></div>
      <div class="dash tres"></div>
      <div class="dash cuatro"></div>
</div>
</body>
</html>

<?php 

if($_GET['confirm'] == true) {

    $counter = 0;


  echo "<script>loadingDisplay()</script>";

  $token = $_SESSION['valid'];

  date_default_timezone_set('Europe/Warsaw');

  $name = $_GET['name'];

  $surname = $_GET['surname'];

  $class = $_GET['class'];

  $number = $_GET['number'];

  $date = date('Y-m-d H:i:s', time());

  $host = gethostbyaddr($_SERVER['REMOTE_ADDR']);

  if($counter <= 0) {
    $counter++;
    $conn = mysqli_connect('localhost', 'Admin', 'c4ruzx6nAzca', 'student_system');
  
    $query = "INSERT INTO students_" . $_SESSION['valid'] . " VALUES ('$name', '$surname', '$class', '$number', '$date', '$host')";
    /* $query = "INSERT INTO temp_students VALUES ('$name', '$surname', '$class', '$number', '$date', '$host')"; */
    
    $stmt = $conn->prepare($query);
    
    $stmt->execute();
  
    $filePath = $_SERVER['DOCUMENT_ROOT'] . '/log/' . date('Y_m_d_H-i-s', time()) . '_register-log.txt';
      
    $content = "A session from " . gethostbyaddr($_SERVER['REMOTE_ADDR']) . "with token: " . $token . " has successfully registered with " . $name . "," . $surname . "," . $class . "," . $number . "";
      
    file_put_contents($filePath, $content);
  }
}


?>