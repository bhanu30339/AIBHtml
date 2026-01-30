<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
	exit;
}

$rawBody = file_get_contents('php://input');
$jsonData = json_decode($rawBody, true);

$name = htmlspecialchars($jsonData['fullName'] ?? $jsonData['name'] ?? $_POST['fullName'] ?? $_POST['name'] ?? '');
$email = htmlspecialchars($jsonData['email'] ?? $_POST['email'] ?? '');
$phone = htmlspecialchars($jsonData['phone'] ?? $_POST['phone'] ?? '');
$subject = htmlspecialchars($jsonData['subject'] ?? $_POST['subject'] ?? '');
$enquiryType = htmlspecialchars($jsonData['enquiryType'] ?? $_POST['enquiryType'] ?? '');
$message = htmlspecialchars($jsonData['message'] ?? $_POST['message'] ?? '');

if (!$name || !$email || !$subject || !$message || !$enquiryType) {
	http_response_code(400);
	echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
	exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	http_response_code(400);
	echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
	exit;
}

$smtpHost = getenv('SMTP_HOST');
$smtpPort = getenv('SMTP_PORT');
$smtpUser = getenv('SMTP_USER');
$smtpPass = getenv('SMTP_PASS');
$smtpSecure = getenv('SMTP_SECURE') ?: 'tls';

if (!$smtpHost || !$smtpPort || !$smtpUser || !$smtpPass) {
	http_response_code(500);
	echo json_encode(['success' => false, 'message' => 'Server email configuration is missing.']);
	exit;
}

$mail = new PHPMailer(true);

try {
	$mail->isSMTP();
	$mail->Host = $smtpHost;
	$mail->SMTPAuth = true;
	$mail->Username = $smtpUser;
	$mail->Password = $smtpPass;
	$mail->SMTPSecure = $smtpSecure === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
	$mail->Port = (int) $smtpPort;

	$mail->setFrom($smtpUser, 'Website Contact');
	$mail->addAddress($smtpUser);
	$mail->addReplyTo($email, $name);

	$mail->isHTML(true);
	$mail->Subject = 'New Contact Form Submission - ' . $subject;
	$mail->Body = "
		<strong>Name:</strong> {$name}<br>
		<strong>Email:</strong> {$email}<br>
		<strong>Phone:</strong> {$phone}<br>
		<strong>Enquiry Type:</strong> {$enquiryType}<br>
		<strong>Subject:</strong> {$subject}<br>
		<strong>Message:</strong><br>{$message}
	";

	$mail->send();

	// Send confirmation email to the user
	$confirmationMail = new PHPMailer(true);
	$confirmationMail->isSMTP();
	$confirmationMail->Host = $smtpHost;
	$confirmationMail->SMTPAuth = true;
	$confirmationMail->Username = $smtpUser;
	$confirmationMail->Password = $smtpPass;
	$confirmationMail->SMTPSecure = $smtpSecure === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
	$confirmationMail->Port = (int) $smtpPort;

	$confirmationMail->setFrom($smtpUser, 'AusInd Bridge');
	$confirmationMail->addAddress($email, $name);

	$confirmationMail->isHTML(true);
	$confirmationMail->Subject = 'Thanks for contacting AusInd Bridge';
	$confirmationMail->Body = "
		<p>Hi {$name},</p>
		<p>Thank you for reaching out to AusInd Bridge about <strong>{$enquiryType}</strong>. Our team has received your message and will get back to you shortly.</p>
		<p>Here is a copy for your records:</p>
		<p><strong>Subject:</strong> {$subject}<br>
		<strong>Message:</strong><br>" . nl2br($message) . "</p>
		<p>Warm regards,<br>AusInd Bridge Team</p>
	";
	$confirmationMail->AltBody = "Hi {$name},\n\nThank you for contacting AusInd Bridge about {$enquiryType}. We received your message and will get back to you shortly.\n\nSubject: {$subject}\nMessage: {$message}\n\nWarm regards,\nAusInd Bridge Team";

	$confirmationMail->send();
	echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode(['success' => false, 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
}