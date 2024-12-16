<?php 
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
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <link href="/css/style.css" rel="stylesheet"/>
  <link rel="stylesheet" type="text/css" href="/css/main.css" />
  <script src="/scripts/script.js"></script>
  <script src="https://code.jquery.com/jquery-2.1.4.js"></script>
  <title>Make a user</title>
</head>
<body>
  <div id="error-popup">
    <div id="error-inner">
  <i class='bx bxs-error'></i>
    <h4>Bład!</h4>
  </div>
  <p>Format wprowadzonych danych jest nie poprawny.</p>
  </div>
<div id="wrapper">
    <form id="form" autocomplete="off" action="/final.php" method="GET">
    <input autocomplete="false" name="source" value="main" type="text" style="display:none;">
        <div class="input-wrapper" id="1">
        <input type="text" maxlength="32" placeholder="Twoje imie" name="name" id="name" class="input">
        <button class="next" id="child-2" onclick="nextInput(this.id);"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div class="input-wrapper" id="2">
        <input type="text" maxlength="32" placeholder="Twoje nazwisko" name="surname" id="surname" class="input">
        <button class="prev" id="child-3" onclick="prevInput(this.id);"><i class='bx bx-left-arrow-alt'></i></button>
        <button class="next" id="child-3" onclick="nextInput(this.id);"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div class="input-wrapper" id="3">
        <input type="text" maxlength="2" pattern="[1-5]{1}[a-h]{1}" placeholder="Twoja klasa" name="class" id="class" class="input">
        <button class="prev" id="child-4" onclick="prevInput(this.id);"><i class='bx bx-left-arrow-alt'></i></button>
        <button class="next" id="child-4" onclick="nextInput(this.id);"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div class="input-wrapper" id="4">
        <input type="text" maxlength="2" pattern="[0-3]{1}[0-9]{1}" placeholder="Twoj numer w dzienniku" name="number" id="number" class="input">
        <button class="prev" id="child-5" onclick="prevInput(this.id);"><i class='bx bx-left-arrow-alt'></i></button>
        <button class="next" id="child-5" onclick="nextInput(this.id);"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div class="input-wrapper" id="5">
        <input type="mail" placeholder="Twoj e-mail" name="mail" id="mail" class="input">
        <button class="prev" id="child-6" onclick="prevInput(this.id);"><i class='bx bx-left-arrow-alt'></i></button>
        <button name="confirm" class="confirm next" onsubmit="loadingDisplay();" value="true"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
    </form>
</div>
</body>
<script>
$(document).ready(function() {

    $( document ).on( 'keydown', function ( e ) {
      if (!$('.input').is(":focus")) {
        $('.input').focus();
      }
    });
  });
  </script>
</html>