<?php
/**
 * Razorpay PHP Backend Configuration
 * 90s chya athavani Jewellery
 */

// 1. CORS Headers for React Frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Razorpay-Signature");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Razorpay Live Credentials
// (Keep Secret strictly here on server-side)
define('RAZORPAY_KEY_ID', getenv('RAZORPAY_KEY_ID') ?: 'rzp_live_TaKGbG6vDu7a0e');
define('RAZORPAY_KEY_SECRET', getenv('RAZORPAY_KEY_SECRET') ?: 'qghQR1rVFSdUqFxDgNqEfPM6');
define('RAZORPAY_WEBHOOK_SECRET', getenv('RAZORPAY_WEBHOOK_SECRET') ?: 'qghQR1rVFSdUqFxDgNqEfPM6');

// 3. Autoload Composer dependencies if vendor exists
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

/**
 * JSON Response Helper
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit();
}

/**
 * Native cURL Razorpay Order Creator (works without Composer SDK)
 */
function createRazorpayOrderNative($amountInPaise, $currency, $receipt, $notes = []) {
    $url = 'https://api.razorpay.com/v1/orders';
    $postData = [
        'amount'   => (int)$amountInPaise,
        'currency' => $currency ?: 'INR',
        'receipt'  => $receipt,
        'notes'    => $notes
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        throw new Exception("cURL Error: " . $curlError);
    }

    $result = json_decode($response, true);
    if ($httpCode >= 400 || isset($result['error'])) {
        $msg = isset($result['error']['description']) ? $result['error']['description'] : 'Razorpay API error';
        throw new Exception($msg, $httpCode);
    }

    return $result;
}

/**
 * Native HMAC-SHA256 Razorpay Signature Verifier
 */
function verifyRazorpaySignatureNative($orderId, $paymentId, $signature) {
    $expectedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, RAZORPAY_KEY_SECRET);
    return hash_equals($expectedSignature, $signature);
}
