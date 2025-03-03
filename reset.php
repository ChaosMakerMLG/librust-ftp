<?php
session_start();

if (empty($_SESSION['valid'])) {
  header('location:/');
  exit;
}

include 'code_gen.php';
include 'encrypt.php';

$code = random_digits(6);

$encrypted = secured_encrypt($code);

if (isset($_GET['source'])) {

  $code = $_GET['code'];

  $expected = $_GET['source'];

  $email = $_GET['email'];

}

?>

<!DOCTYPE html>
<html lang="pl_PL">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <link href="/css/style.css" rel="stylesheet" />
  <link href="/css/reset.css" rel="stylesheet" />
  <link href="/css/global.css" rel="stylesheet" />
  <script src="/scripts/reset.js"></script>
  <script src="https://code.jquery.com/jquery-2.1.4.js"></script>
  <title></title>
</head>

<body>
  <div id="info-popup">
    <div id="info-inner"><i class='bx bxs-check-circle'></i>
      <h1>Kod wysłany</h1>
      <h4>Na podany adres został wysłany email z kodem. Sprawdz swoją skrzynkę lub spam</h4>
      <h5>Nie widzisz maila? Wyślij ponownie</h5>
      <button onclick="attemptMail('child-2');" id="resend"><i class='bx bx-redo'></i></button>
    </div>
    <div id="error-inner"><i class='bx bxs-error-alt'></i>
      <h1>Błąd</h1>
      <h4>Wprowadzony kod jest błędny</h4>
      <h5>Nie widzisz maila? Wyślij ponownie</h5>
      <button onclick="attemptMail('child-2');" id="resend"><i class='bx bx-redo'></i></button>
    </div>
    <div id="mail-error-inner"><i class='bx bxs-error-alt'></i>
      <h1>Błąd</h1>
      <h4>Wprowadzony email nie jest przypisany do żadnego konta</h4>
    </div>
  </div>
  <div id="wrapper">
    <form name="theForm" id="form" autocomplete="off" action="" method="GET">
      <input autocomplete="false" id="expected" name="source" value="<?php echo $encrypted; ?>" type="text" style="display:none;">
      <div id="1" class="input-wrapper">
        <input required="required" value="<?php if (isset($_GET['email'])) echo $_GET['email']; ?>" type="text" placeholder="Twój email" name="email" class="input" id="mail">
        <button name="confirm" class="next" id="child-2" value="true" onclick="nextInput(this.id)" type="submit"><i class='bx bx-right-arrow-alt'></i></button>
      </div>
      <div id="2" class="input-wrapper">
        <input required="required" type="text" placeholder="Kod weryfikacyjny" name="code" class="input" id="code">
        <button name="confirm" class="next" id="child-3" value="true" onclick="nextInput(this.id)" type="submit"><i class='bx bx-right-arrow-alt'></i></button>
      </div>
      <div style="display: none;" class="input-wrapper" id="4">
        <button style="display: none;" class="next" id="child-4"></button>
        <input style="display: none;" class="input">
      </div>
    </form>
  </div>

<?php 

if (!isset($_SESSION['reset']) && isset($_GET['source'])) {

  echo '<script>inputFix();</script>';

  $code = $_GET['code'];

  $expected = secured_decrypt($_GET['source']);

  $email = $_GET['email'];

  if ($code == $expected) {

    $conn = mysqli_connect('localhost', 'admin1', 'zaq1@WSX', 'student_system');

    $stmt = $conn->prepare("SELECT login, passwd FROM user_list WHERE mail='$email'");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = mysqli_fetch_assoc($result);
    $stmt->close();

    
    function generateNewPassword($existingPassword) {
      // Extract the fixed part from the existing password (everything except the last 5 characters)
      $fixedPart = substr($existingPassword, 0, -5);  // Remove the last 5 characters
      
      // Generate 5 random alphanumeric characters
      $randomChars = '';
      $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      for ($i = 0; $i < 5; $i++) {
        $randomChars .= $characters[rand(0, strlen($characters) - 1)];
      }
      
      // Concatenate the fixed part with the new random characters
      $newPassword = $fixedPart . $randomChars;
      
      return $newPassword;
    }
    echo '<script>codeCorrect();</script>';

      $username = $row['login'];
      $existingPassword = $row['passwd'];
  
      // Generate the new password based on the existing one
      $newPassword = generateNewPassword($existingPassword);
  
      $stmt = $conn->prepare("UPDATE user_list SET passwd='$newPassword' WHERE mail='$email'");
      $stmt->execute();
      
      $stmt = $conn->prepare("SELECT login, passwd FROM user_list WHERE mail='$email'");
      $stmt->execute();
      $result = $stmt->get_result();
      $row = mysqli_fetch_assoc($result);

      $stmt->close();

      $_SESSION['reset'] = true;

    echo '<script>codeCorrect();</script>';
  } else {
    echo '<script>codeIncorrect();</script>';
  }
}

?>
<div id="credentials-inner"><i class='bx bxs-check-circle'></i>
      <h1>Powodzenie</h1>
      <h4>Login - <?php if ($code === $expected) echo $row['login']; ?></h4>
      <h4>Hasło - <?php if ($code === $expected) echo $row['passwd']; ?></h4>
</div>
</body>
<script>
  $(document).ready(function() {
    $(document).on('keydown', function(e) {
      if (e.key !== 'Enter' && !$('.input').is(":focus")) {
        $('.input').focus();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if ($('.input-wrapper.active').children('.input').val()) {
          $('#next').click();
        }
        return false;
      }
    });
  });
</script>
</html>