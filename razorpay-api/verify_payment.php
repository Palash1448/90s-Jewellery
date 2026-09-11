<?php
/**
 * Razorpay Verify Payment Endpoint
 * POST /verify_payment.php
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

$firebaseOrderId    = isset($data['firebaseOrderId']) ? trim($data['firebaseOrderId']) : '';
$razorpayPaymentId  = isset($data['razorpay_payment_id']) ? trim($data['razorpay_payment_id']) : '';
$razorpayOrderId    = isset($data['razorpay_order_id']) ? trim($data['razorpay_order_id']) : '';
$razorpaySignature  = isset($data['razorpay_signature']) ? trim($data['razorpay_signature']) : '';

if (empty($razorpayPaymentId) || empty($razorpayOrderId) || empty($razorpaySignature)) {
    sendJsonResponse([
        'success' => false,
        'error'   => 'Missing required payment verification parameters (razorpay_payment_id, razorpay_order_id, razorpay_signature).'
    ], 400);
}

try {
    $isSignatureValid = false;

    // 1. Verify via Razorpay SDK if available
    if (class_exists('Razorpay\Api\Api')) {
        $api = new \Razorpay\Api\Api(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
        $attributes = [
            'razorpay_order_id'   => $razorpayOrderId,
            'razorpay_payment_id' => $razorpayPaymentId,
            'razorpay_signature'  => $razorpaySignature
        ];

        $api->utility->verifyPaymentSignature($attributes);
        $isSignatureValid = true;
    } else {
        // 2. Verify via native cryptographic hash_hmac
        $isSignatureValid = verifyRazorpaySignatureNative($razorpayOrderId, $razorpayPaymentId, $razorpaySignature);
    }

    if ($isSignatureValid) {
        sendJsonResponse([
            'success'            => true,
            'verified'           => true,
            'firebaseOrderId'    => $firebaseOrderId,
            'razorpayOrderId'    => $razorpayOrderId,
            'razorpayPaymentId'  => $razorpayPaymentId,
            'message'            => 'Razorpay signature verified successfully.'
        ]);
    } else {
        sendJsonResponse([
            'success'  => false,
            'verified' => false,
            'error'    => 'Invalid payment signature. Verification failed.'
        ], 400);
    }
} catch (Exception $e) {
    sendJsonResponse([
        'success'  => false,
        'verified' => false,
        'error'    => $e->getMessage()
    ], 400);
}
