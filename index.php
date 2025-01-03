<!DOCTYPE html>
<html lang="pl_PL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link href="css/style.css" rel="stylesheet"/>
    <script src="/scripts/script.js"></script>
    <script src="/scripts/index.js"></script>
    <script src="https://code.jquery.com/jquery-2.1.4.js"></script>
    <title>Document</title>
</head>
<body>
<?php 


$div = '<div id="jok"><h1>Brawo kurwa, myslisz ze jestem debilem?</h1><h3>Przeładuj sobie przyciskiem pod spodem bo cie nie wpusci. I skończ dotykać mój kod...</h3><form method="post"><button name="button1" value="button1" type="submit"><i class="bx bxs-skull"></i></button></form></div>';

if($_COOKIE['jok'] !== NULL) {
  echo $div;
}

if(array_key_exists('button1', $_POST)) {
  header('location:/');
  imSorry();
}

function imSorry() {
  unset($_COOKIE['jok']);
  setcookie('jok', '', -1, '/'); 
  return true;
  session_destroy();
  header('location:/');
  header("Refresh:0");
}

?>
<div id='about-wrapper' >
  <i id="info" onclick="goToAbout();" class='bx bxs-info-circle'></i>
</div>
    <div id="wrapper">
    <form id="form" autocomplete="off" action="/validation.php" method="GET">
    <input autocomplete="false" name="source" value="index" type="text" style="display:none;">
        <div class="input-wrapper">
          <!-- <label id="label">Token</label> -->
        <input required="required" type="text" placeholder="Token..." name="token" id="token">
        <button name="confirm" id="next" value="true" onsubmit="fadeIn();" type="submit"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
    </form>
    </div>
</body>
<script>
$(document).ready(function() {
/*   $(document).on('keydown', function(e) {
        switch (e.key) {
            case 'ArrowRight':
              id = $(".visible>button.next").first().attr('id');
                nextInput(id);
                break;
            case 'Enter':
              id = $(".visible>button.next").first().attr('id');
                nextInput(id);
                break;
        }
    }); */
    $( document ).on( 'keydown', function ( e ) {
      if (!$('#token').is(":focus")) {
        $('#token').focus();
      }
      if(e.key === 'Enter') {
        $('#next').click();
      }
    });
  });
  </script>
</html>

<?php
session_start();
session_unset();

if (ini_get("session.use_cookies")) {
  $params = session_get_cookie_params();
  setcookie(session_name(), '', time() - 42000,
      $params["path"], $params["domain"],
      $params["secure"], $params["httponly"]
  );
}
exit;

?>