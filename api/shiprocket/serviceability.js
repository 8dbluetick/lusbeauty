/**
 * Lush Beauty Mart — Shiprocket Courier Serviceability API Handler
 * Secure Server-Side / Serverless Function
 *
 * Requirements:
 * - Environment variables: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD
 * - Never expose credentials or secret tokens to frontend client
 */

let cachedToken = null;
let tokenExpiry = 0;

const LUSH_PICKUP_POSTCODE = process.env.LUSH_PICKUP_PINCODE || '440010'; // Nagpur Lad Square Showroom

async function getShiprocketToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.warn('[Shiprocket] Missing SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD environment variables.');
    return null;
  }

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      console.error('[Shiprocket Auth Error]', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    if (data && data.token) {
      cachedToken = data.token;
      // Shiprocket tokens last ~10 days. We refresh after 8 days.
      tokenExpiry = now + 8 * 24 * 60 * 60 * 1000;
      return cachedToken;
    }
  } catch (err) {
    console.error('[Shiprocket Auth Exception]', err);
  }

  return null;
}

module.exports = async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const delivery_postcode = url.searchParams.get('delivery_postcode');
  const weight = parseFloat(url.searchParams.get('weight') || '0.5'); // kg
  const cod = url.searchParams.get('cod') === '1' ? 1 : 0;
  const declared_value = parseFloat(url.searchParams.get('declared_value') || '0');

  // 1. Validate 6-digit Pincode
  if (!delivery_postcode || !/^\d{6}$/.test(delivery_postcode)) {
    return res.status(400).json({
      serviceable: false,
      error: 'Invalid 6-digit pincode provided',
    });
  }

  // 2. Check Nagpur Local District (440xxx - 441xxx)
  const isNagpurLocal = delivery_postcode.startsWith('440') || delivery_postcode.startsWith('441');
  if (isNagpurLocal) {
    return res.status(200).json({
      serviceable: true,
      is_nagpur_local: true,
      estimated_days: 'Same-Day / Next-Day',
      courier_name: 'Nagpur Local Showroom Express',
      shipping_rate: declared_value >= 999 ? 0 : 49,
      is_free: declared_value >= 999,
      city: 'Nagpur',
      state: 'Maharashtra',
      pickup_ready: true,
    });
  }

  // 3. Authenticate with Shiprocket
  const token = await getShiprocketToken();
  if (!token) {
    // If Shiprocket credentials not yet supplied in environment, return safe defaults
    return res.status(200).json({
      serviceable: true,
      is_nagpur_local: false,
      estimated_days: '3–5 business days',
      courier_name: 'Shiprocket Tracked Courier',
      shipping_rate: declared_value >= 999 ? 0 : 79,
      is_free: declared_value >= 999,
    });
  }

  // 4. Query Shiprocket Courier Serviceability API
  try {
    const params = new URLSearchParams({
      pickup_postcode: LUSH_PICKUP_POSTCODE,
      delivery_postcode: delivery_postcode,
      weight: String(weight),
      cod: String(cod),
    });

    const srRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!srRes.ok) {
      return res.status(200).json({
        serviceable: false,
        error: 'Pincode not serviceable via Shiprocket network',
      });
    }

    const srData = await srRes.json();
    const couriers = srData?.data?.available_courier_companies || [];

    if (couriers.length === 0) {
      return res.status(200).json({
        serviceable: false,
        error: 'No active couriers available for this postal code',
      });
    }

    // Sort by best rating and lowest ETD (Estimated Delivery Time)
    couriers.sort((a, b) => (parseFloat(a.etd_hours || '72') - parseFloat(b.etd_hours || '72')));
    const bestCourier = couriers[0];

    const etdHours = parseInt(bestCourier.etd_hours || '72', 10);
    const etdDays = Math.max(2, Math.ceil(etdHours / 24));
    const rawRate = parseFloat(bestCourier.rate || '79');
    const isFree = declared_value >= 999;

    return res.status(200).json({
      serviceable: true,
      is_nagpur_local: false,
      estimated_days: `${etdDays}–${etdDays + 2} business days`,
      courier_name: bestCourier.courier_name || 'Shiprocket Verified Courier',
      shipping_rate: isFree ? 0 : Math.round(rawRate),
      is_free: isFree,
      city: bestCourier.city || '',
      state: bestCourier.state || '',
    });
  } catch (err) {
    console.error('[Shiprocket API Query Error]', err);
    return res.status(200).json({
      serviceable: true,
      is_nagpur_local: false,
      estimated_days: '3–5 business days',
      courier_name: 'Shiprocket Tracked Courier',
      shipping_rate: declared_value >= 999 ? 0 : 79,
      is_free: declared_value >= 999,
    });
  }
};
