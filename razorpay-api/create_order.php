<?php
/**
 * Razorpay Create Order Endpoint
 * POST /create_order.php
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Method not allowed. Only POST is accepted.'], 405);
}

// Read JSON body
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    sendJsonResponse(['success' => false, 'error' => 'Invalid JSON payload.'], 400);
}

$firebaseOrderId = isset($data['firebaseOrderId']) ? trim($data['firebaseOrderId']) : '';
$amountInRupees  = isset($data['amount']) ? floatval($data['amount']) : 0;
$currency        = isset($data['currency']) ? strtoupper(trim($data['currency'])) : 'INR';
$notes           = isset($data['notes']) && is_array($data['notes']) ? $data['notes'] : [];

if (empty($firebaseOrderId)) {
    sendJsonResponse(['success' => false, 'error' => 'firebaseOrderId is required.'], 400);
}

if ($amountInRupees <= 0) {
    sendJsonResponse(['success' => false, 'error' => 'Valid amount is required.'], 400);
}

// Convert rupees to paise
$amountInPaise = round($amountInRupees * 100);

$notes['firebaseOrderId'] = $firebaseOrderId;
$notes['platform'] = '90s chya athavani Web';

try {
    // If official Razorpay SDK exists via Composer, use it
    if (class_exists('Razorpay\Api\Api')) {
        $api = new \Razorpay\Api\Api(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
        $razorpayOrder = $api->order->create([
            'receipt'  => $firebaseOrderId,
            'amount'   => $amountInPaise,
            'currency' => $currency,
            'notes'    => $notes
        ]);

        sendJsonResponse([
            'success'         => true,
            'razorpayOrderId' => $razorpayOrder['id'],
            'amount'          => $razorpayOrder['amount'],
            'currency'        => $razorpayOrder['currency'],
            'keyId'           => RAZORPAY_KEY_ID
        ]);
    } else {
        // Fallback to high-performance native cURL implementation
        $razorpayOrder = createRazorpayOrderNative($amountInPaise, $currency, $firebaseOrderId, $notes);

        sendJsonResponse([
            'success'         => true,
            'razorpayOrderId' => $razorpayOrder['id'],
            'amount'          => $razorpayOrder['amount'],
            'currency'        => $razorpayOrder['currency'],
            'keyId'           => RAZORPAY_KEY_ID
        ]);
    }
} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'error'   => $e->getMessage()
    ], 500);
}
