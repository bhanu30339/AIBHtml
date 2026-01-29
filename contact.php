<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/Exception.php';
require 'vendor/PHPMailer.php';
require 'vendor/SMTP.php';

$mail = new PHPMailer(true);

fetch('/contact.php', { // Use the clean path without .php if you applied the htaccess fix
    method: 'POST',
    body: new FormData(document.getElementById('contactForm'))
})

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@ausindbridge.org';
    $mail->Password   = 'Ausindbridge1!';
    $mail->SMTPSecure = 'ssl'; // Use 'tls' if using port 587
    $mail->Port       = 465;

    $mail->setFrom('info@ausindbridge.org', 'Website Contact');
    // $mail->addAddress('YOUR_PERSONAL_EMAIL@GMAIL.COM'); // Where you receive the mail

    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Message';
    $mail->Body    = "Message from: " . $_POST['email'];

    $mail->send();
    echo 'success';
} catch (Exception $e) {
    echo "Error: {$mail->ErrorInfo}";
}
?>