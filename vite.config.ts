import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import crypto from 'node:crypto'

/**
 * Local Development & Preview Middleware for Razorpay API
 * Allows React to make POST requests to /razorpay-api/ without needing a local Apache/PHP server.
 * In production on Apache/cPanel, the real PHP scripts in /razorpay-api/ handle requests.
 */
function razorpayDevServerPlugin(): Plugin {
  const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TaKGbG6vDu7a0e';
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'qghQR1rVFSdUqFxDgNqEfPM6';

  const handler = (req: any, res: any, next: any) => {
    // 1. Handle Create Order
    if (req.url && (req.url === '/razorpay-api/create_order.php' || req.url.startsWith('/razorpay-api/create_order.php?'))) {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.statusCode = 200;
        res.end();
        return;
      }

      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
        return;
      }

      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body || '{}');
          const { firebaseOrderId, amount, currency = 'INR', notes = {} } = payload;

          if (!firebaseOrderId || !amount) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'firebaseOrderId and amount are required.' }));
            return;
          }

          const amountInPaise = Math.round(Number(amount) * 100);
          const basicAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

          const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${basicAuth}`,
            },
            body: JSON.stringify({
              amount: amountInPaise,
              currency,
              receipt: firebaseOrderId,
              notes: {
                ...notes,
                firebaseOrderId,
                platform: '90s chya athavani Web',
              },
            }),
          });

          const rzpData: any = await rzpResponse.json();

          if (!rzpResponse.ok || rzpData.error) {
            res.statusCode = rzpResponse.status || 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: rzpData.error?.description || 'Failed to create Razorpay order',
            }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            razorpayOrderId: rzpData.id,
            amount: rzpData.amount,
            currency: rzpData.currency,
            keyId: RAZORPAY_KEY_ID,
          }));
        } catch (error: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: error.message || 'Internal dev server error' }));
        }
      });
      return;
    }

    // 2. Handle Verify Payment
    if (req.url && (req.url === '/razorpay-api/verify_payment.php' || req.url.startsWith('/razorpay-api/verify_payment.php?'))) {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.statusCode = 200;
        res.end();
        return;
      }

      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
        return;
      }

      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Missing payment signature parameters' }));
            return;
          }

          const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

          const verified = crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(razorpay_signature)
          );

          if (!verified) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, verified: false, error: 'Signature verification mismatch' }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            verified: true,
            message: 'Signature verified successfully',
          }));
        } catch (error: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: error.message || 'Internal dev server error' }));
        }
      });
      return;
    }

    next();
  };

  return {
    name: 'razorpay-dev-server',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    razorpayDevServerPlugin(),
  ],
})

