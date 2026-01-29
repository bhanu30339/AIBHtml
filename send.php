<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mail = new PHPMailer(true);

    try {
        // --- Hostinger SMTP Settings ---
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@ausindbridge.org'; // Your Hostinger email
        $mail->Password   = 'Ausindbridge1!';       // Your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // --- Recipients ---
        $mail->setFrom('info@ausindbridge.org', 'Website Contact');
        // $mail->addAddress('receiver-email@gmail.com'); // Where you want to get the mail

        // --- Content ---
        $mail->isHTML(true);
        $mail->Subject = 'New Message from Website';
        $mail->Body    = "Name: " . $_POST['name'] . "<br>Email: " . $_POST['email'] . "<br>Message: " . $_POST['message'];

        $mail->send();
        echo "success";
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>