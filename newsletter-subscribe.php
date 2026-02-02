<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    $data = $_POST;
}

$email = isset($data['email']) ? trim($data['email']) : '';
$firstName = isset($data['firstName']) ? trim($data['firstName']) : '';

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

$apiKey = getenv('MAILCHIMP_API_KEY');
$listId = getenv('MAILCHIMP_AUDIENCE_ID');
$dataCenter = getenv('MAILCHIMP_DC');

if (!$dataCenter && strpos($apiKey, '-') !== false) {
    $dataCenter = substr($apiKey, strpos($apiKey, '-') + 1);
}

if (!$apiKey || !$listId || !$dataCenter) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mailchimp configuration is missing on the server.']);
    exit;
}

$subscriberHash = md5(strtolower($email));
$endpoint = sprintf('https://%s.api.mailchimp.com/3.0/lists/%s/members/%s', $dataCenter, $listId, $subscriberHash);

$payload = [
    'email_address' => $email,
    'status_if_new' => 'subscribed',
    'status' => 'subscribed'
];

if ($firstName !== '') {
    $payload['merge_fields'] = ['FNAME' => $firstName];
}

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_USERPWD => 'anystring:' . $apiKey,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10
]);

$response = curl_exec($ch);
$curlError = curl_error($ch);
$statusCode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Unable to reach Mailchimp. Please try again later.']);
    exit;
}

$responseData = json_decode($response, true);

if ($statusCode >= 200 && $statusCode < 300) {
    echo json_encode(['success' => true, 'message' => 'Thanks you\'re on the list!']);
    exit;
}

$errorMessage = $responseData['detail'] ?? 'Subscription failed. Please try again.';
http_response_code($statusCode ?: 500);
echo json_encode(['success' => false, 'message' => $errorMessage]);
