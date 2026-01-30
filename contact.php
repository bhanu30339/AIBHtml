<?php
http_response_code(410);
header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'message' => 'Deprecated endpoint. Use send-mail.php.'
]);
exit;
?>