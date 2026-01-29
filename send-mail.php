 <!-- <?php -->
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require __DIR__ . '/vendor/autoload.php'; // adjust path if needed

// $mail = new PHPMailer(true);

// try {
 // Server settings
//  $mail->isSMTP();
//  $mail->Host = 'smtp.hostinger.com'; // e.g. smtp.hostinger.com
//  $mail->SMTPAuth = true;
//  $mail->Username = 'info@ausindbridge.org';
//  $mail->Password = 'Ausindbridge1!';
//  $mail->SMTPSecure = tsl; // or ENCRYPTION_SMTPS for SSL
//  $mail->Port = 587; // or 465 if you use SSL

 // Sender & recipient
//  $mail->setFrom('info@ausindbridge.org', 'Your Name or Site');
//  $mail->addAddress('bhanuaprakashanumuladasu@example.com', 'Recipient Name');

 // Content
//  $mail->isHTML(true);
//  $mail->Subject = 'SMTP test from Hostinger';
//  $mail->Body = 'This is a <b>test email</b> sent via SMTP.';
//  $mail->AltBody = 'This is a test email sent via SMTP.';

//  $mail->send();
//  echo 'Message sent successfully';
// } catch (Exception $e) {
//  echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
// }