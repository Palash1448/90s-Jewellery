<?php
/**
 * Razorpay Webhook Endpoint
 * POST /webhook.php
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['success' => false, 'error' => 'Method not allowed.'], 405);
}

$rawInput = file_get_contents('php://input');
$signature = isset($_SERVER['HTTP_X_RAZORPAY_SIGNATURE']) ? $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] : '';

if (empty($signature)) {
    sendJsonResponse(['success' => false, 'error' => 'Missing X-Razorpay-Signature header.'], 400);
}

// 1. Verify Webhook Signature
$expectedSignature = hash_hmac('sha256', $rawInput, RAZORPAY_WEBHOOK_SECRET);

if (!hash_equals($expectedSignature, $signature)) {
    sendJsonResponse(['success' => false, 'error' => 'Invalid webhook signature.'], 400);
}

$event = json_decode($rawInput, true);

if (!$event || !isset($event['event'])) {
    sendJsonResponse(['success' => false, 'error' => 'Invalid webhook event payload.'], 400);
}

$eventType = $event['event'];
$payload   = isset($event['payload']) ? $event['payload'] : [];

// Log event for idempotency and audit (append to log file)
$logEntry = date('Y-m-d H:i:s') . " | Event: {$eventType} | ID: " . ($event['id'] ?? 'unknown') . "\n";
@file_put_contents(__DIR__ . '/webhook_events.log', $logEntry, FILE_APPEND);

switch ($eventType) {
    case 'payment.captured':
    case 'order.paid':
        // Payment captured successfully
        $payment = $payload['payment']['entity'] ?? [];
        $orderId = $payment['order_id'] ?? '';
        $paymentId = $payment['id'] ?? '';
        $notes = $payment['notes'] ?? [];
        $firebaseOrderId = $notes['firebaseOrderId'] ?? '';

        // Webhook received successfully
        sendJsonResponse([
            'success' => true,
            'event'   => $eventType,
            'status'  => 'processed',
            'firebaseOrderId' => $firebaseOrderId,
            'razorpayPaymentId' => $paymentId,
            'razorpayOrderId' => $orderId
        ]);
        break;

    case 'payment.failed':
        // Payment failed
        $payment = $payload['payment']['entity'] ?? [];
        $errorDescription = $payment['error_description'] ?? 'Payment failed';

        sendJsonResponse([
            'success' => true,
            'event'   => $eventType,
            'status'  => 'failed',
            'reason'  => $errorDescription
        ]);
        break;

    default:
        sendJsonResponse([
            'success' => true,
            'event'   => $eventType,
            'status'  => 'ignored'
        ]);
        break;
}
