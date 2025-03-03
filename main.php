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
  <link href="/css/global.css" rel="stylesheet" />
  <script src="/scripts/script.js"></script>
  <script src="https://code.jquery.com/jquery-2.1.4.js"></script>
  <title>Rejestracja</title>
</head>
<body>
  <div id="info-button-wrapper">
    <button id="info-button" class="i" onclick="formatInfo();">
      <i class='bx bx-info-circle'></i>
  </button>
</div>
  <div id="error-popup">
    <div id="error-inner"><div id="error-header"><i class='bx bxs-error-alt'></i><button class="x" onclick="errorDismiss();"><i class='bx bx-x'></i></button></div><h4>Niepoprawny format</h4></div>
  </div>
<ul id="list-wrapper">
</ul>
</div>
<div id="wrapper">
    <form id="form" autocomplete="off" action="/final.php" method="GET">
    <input autocomplete="false" name="source" value="main" type="text" style="display:none;">
    <div id="popup-final">
      <span><h2>Czy te dane są poprawne?</h2></span>
      <span><h5>* Aby edytowac dane kliknij na element z listy</h5></span>
    <button name="confirm" onsubmit="loadingDisplay();" value="true"><i class='bx bx-check'></i></button>
    </div>
    <!-- <div id="reset"><i class='bx bx-revision' ></i><span>Reset hasla</span></div> -->
    <div id="inputs">
        <div class="input-wrapper" style="--background-size: 5% auto" id="1">
        <input type="text" maxlength="32" placeholder="Twoje imię" name="name" id="name" class="input">
        <button class="next" id="child-2" onclick="nextInput(this.id);"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div class="input-wrapper" style="--background-size: 20% auto" id="2">
        <input type="text" maxlength="32" placeholder="Twoje nazwisko" name="surname" id="surname" class="input">
        <button class="prev" id="child-3" onclick="prevInput(this.id);"><i class='bx bx-left-arrow-alt'></i></button>
        <button class="next" id="child-3" onclick="nextInput(this.id);"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div class="input-wrapper" style="--background-size: 40% auto" id="3">
        <input type="text" maxlength="2" pattern="[1-5]{1}[a-h]{1}" placeholder="Twoja klasa" name="class" id="class" class="input">
        <button class="prev" id="child-4" onclick="prevInput(this.id);"><i class='bx bx-left-arrow-alt'></i></button>
        <button class="next" id="child-4" onclick="nextInput(this.id);"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div class="input-wrapper" style="--background-size: 60% auto" id="4">
        <input type="text" maxlength="2" pattern="[0-3]{1}[0-9]{1}" placeholder="Twój numer w dzienniku" name="number" id="number" class="input">
        <button class="prev" id="child-5" onclick="prevInput(this.id);"><i class='bx bx-left-arrow-alt'></i></button>
        <button class="next" id="child-5" onclick="nextInput(this.id);"><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div class="input-wrapper" style="--background-size: 80% auto" id="5">
        <input type="mail" placeholder="Twoj e-mail" name="mail" id="mail" class="input">
        <button class="prev" id="child-6" onclick="prevInput(this.id);"><i class='bx bx-left-arrow-alt'></i></button>
        <button class="next" id="child-6" onclick="nextInput(this.id);" ><i class='bx bx-right-arrow-alt'></i></button>
        </div>
        <div style="display: none;" class="input-wrapper" id="6">
        <button style="display: none;" class="next" id="child-6"></button>
        <input style="display: none;" class="input">
        </div>
      </div>
    </form>
</div>
<div id="info">
  <div id="info-header"><button id="close" onclick="formatInfo();"><i class='bx bx-x'></i></button></div>
  <ul id="info-list">
  <h3>Zasady Formatowania</h3>
    <h4>Imię i Nazwisko</h4>
    <li id="rule1">Pierwsza wielka litera</li>
    <li id="rule11">Pełne imię i nazwisko</li>
    <h4>Klasa</h4>
    <li id="rule2">Cyfry arabskie w zakresie (1-5) </li>
    <li id="rule22">Tylko małe litery</li>
    <h4>Numer z dziennika</h4>
    <li id="rule3">Numery pojedyncze np. 1 zapisane z przedrostkiem 0</li>
  </ul>
</div>
<div>
</body>
<script>
$(document).ready(function() {
    $( document ).on( 'keydown', function ( e ) {
      if(e.key !== 'Enter' && !$('.input').is(":focus")) {
        $('.input').focus();
      }
      if(e.key === 'Enter') {
        e.preventDefault();
        if($( '.input-wrapper.active' ).children( '.input' ).val()){
          $('#next').click();
        }
        return false;
      }
    });
  });
  </script>
</html>