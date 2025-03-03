<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function myReturn()
{

    require 'vendor/autoload.php';


    if (isset($_GET['encrypt'])) {

        include 'encrypt.php';

        $key = $_GET['encrypt'];

        $email = $_GET['mail'];

        $decryptedKey = secured_decrypt($key);

        $conn = mysqli_connect('localhost', 'admin1', 'zaq1@WSX', 'student_system');

        $stmt = $conn->prepare("SELECT mail FROM user_list WHERE mail='$email'");

        $stmt->execute();

        $result = $stmt->get_result();

        $row = mysqli_fetch_assoc($result);

        if (isset($row['mail'])) {

            $mail = new PHPMailer(true);

            try {
                //Server settings
                $mail->SMTPDebug = 2;
                $mail->isSMTP();
                $mail->Host       = 'smtp.mailersend.net';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'MS_0BPVFR@trial-0p7kx4xy767l9yjr.mlsender.net';
                $mail->Password   = 'vqotVVJaAQxYQvnT';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                //Recipients
                $mail->setFrom('MS_0BPVFR@trial-0p7kx4xy767l9yjr.mlsender.net', 'MakeAUser');
                $mail->addAddress($email, 'Odbiorca');

                //Content
                $mail->isHTML(true);
                $mail->Subject = 'Kod weryfikacyjny';
                $mail->Body    = '<h2> Kod Weryfikacyjny - ' . $decryptedKey . '</h1>';
                $mail->AltBody = '';

                $mail->send();
            } catch (Exception $e) {
                return $decryptedKey . $mail->ErrorInfo;
            }

            return $decryptedKey . ' Sent';
        } else {
            return 'nomail';
        }
    }
}

echo myReturn();

?>
