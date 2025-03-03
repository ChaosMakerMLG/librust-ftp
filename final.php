<?php

/* ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
 */
session_start();

if(empty($_SESSION['valid'])) {
  header('location:/');
  exit;
}

if(!isset($_GET['name'], $_GET['surname'], $_GET['class'], $_GET['number'], $_GET['mail'])) {
  setcookie('jok', 'niet', time() + (30000), 'index.php');
  header('Location: /');
  session_destroy();
  exit;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <link href="/css/final.css" rel="stylesheet" />
  <link href="/css/global.css" rel="stylesheet">
  <script src="/scripts/script.js"></script>
  <script src="https://code.jquery.com/jquery-2.1.4.js"></script>
  <title>Poświadczenia</title>
</head>

<body>
  <div id="loading" class="container hidden">
    <div class="dash one"></div>
    <div class="dash dos"></div>
    <div class="dash tres"></div>
    <div class="dash cuatro"></div>
  </div>
  <div id="credentials">
    <h2>Twoje dane logowania</h2>
    <ul class="ul">
      <li class="li"><i class='bx bxs-user'></i>
        <h3 id="login">1</h3>
      </li>
      <li class="li"><i class='bx bxs-lock-alt'></i>
        <h3 id="passwd">2</h3>
      </li>
    </ul>
  </div>
  <?php

  if ($_GET['confirm'] == true) {

    $counter = 0;

    if (!isset($_COOKIE['credentials'])) {
      echo "<script>loadingDisplay()</script>";
    }

    $token = $_SESSION['valid'];

    date_default_timezone_set('Europe/Warsaw');

    $name = $_GET['name'];

    $surname = $_GET['surname'];

    $class = $_GET['class'];

    $number = $_GET['number'];

    $mail = $_GET['mail'];

    $date = date('Y-m-d H:i:s', time());

    $host = gethostbyaddr($_SERVER['REMOTE_ADDR']);

    if (!isset($_SESSION['insert_done'])) {

      $conn = mysqli_connect('localhost', 'admin1', 'zaq1@WSX', 'student_system');

      $query = "INSERT INTO students_" . $token . " VALUES ('$name', '$surname', '$class', '$number', '$mail', '$host', '$date')";
      $stmt = $conn->prepare($query);
      $stmt->execute();

      $_SESSION['insert_done'] = true;
    }
  }
  ?>
  <script>

    const ws = new WebSocket('ws://192.168.1.124:8080'); // Connect to WebSocket server

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.addEventListener('message', (event) => {
      console.log(event.data);
      // Get the client's IP address
      const clientIp = '<?php echo $host; ?>'; // Client IP
      const token = '<?php echo $token; ?>'; // Token
      const mail = '<?php echo $mail; ?>'; // Email

      console.log(clientIp);
      console.log(token);

      const sendData = {
        client_ip: clientIp,
        token: token,
        email: mail
      };

      console.log(sendData);

      $.ajax({
        url: 'execute-query.php',
        type: 'GET',
        data: sendData,
        dataType: "json",
        contentType: "application/json",
        success: function(response) {
          if (response.status === 'no_results') {
            alert('No results found');
          } else if (response.status === 'error') {
            alert('Error: ' + response.message);
          } else {

            console.log(response);

            console.log(response.login);
            console.log(response.passwd);

            document.getElementById('login').innerHTML = response.login;
            document.getElementById('passwd').innerHTML = response.passwd;
            document.getElementById('loading').classList.toggle('hidden');
            document.getElementById('credentials').classList.add('active');
          }
        },
        error: function(xhr, status, error) {
          console.error('There was a problem with the AJAX request:', error);
        }
      });
    });
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  </script>
</body>

</html>