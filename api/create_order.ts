import crypto from 'node:crypto';

const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_live_TaKGbG6vDu7a0e';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'qghQR1rVFSdUqFxDgNqEfPM6';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    // Parse body (in case it arrives as string or object)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { firebaseOrderId, amount, currency = 'INR', notes = {} } = body;

    if (!firebaseOrderId || !amount) {
      return res.status(400).json({ success: false, error: 'firebaseOrderId and amount are required.' });
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
      return res.status(rzpResponse.status || 500).json({
        success: false,
        error: rzpData.error?.description || 'Failed to create Razorpay order',
      });
    }

    return res.status(200).json({
      success: true,
      razorpayOrderId: rzpData.id,
      amount: rzpData.amount,
      currency: rzpData.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Vercel API create_order error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
