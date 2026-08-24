/**
 * Lush Beauty Mart — Shiprocket Order Creation Handler
 * Secure Server-Side Function triggered on Shopify Order Confirmation
 *
 * Requirements:
 * - Environment variables: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, LUSH_PICKUP_LOCATION
 */

async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) return null;

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || null;
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = await getShiprocketToken();
  if (!token) {
    return res.status(500).json({ error: 'Shiprocket authentication failed' });
  }

  const orderData = req.body;
  if (!orderData || !orderData.order_id || !orderData.shipping_address) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  const isPrepaid = (orderData.payment_gateway_names || []).some(
    p => !p.toLowerCase().includes('cash on delivery') && !p.toLowerCase().includes('cod')
  );

  const payload = {
    order_id: String(orderData.order_id),
    order_date: new Date(orderData.created_at || Date.now()).toISOString().slice(0, 19).replace('T', ' '),
    pickup_location: process.env.LUSH_PICKUP_LOCATION || 'Nagpur Lad Square Showroom',
    billing_customer_name: orderData.shipping_address.first_name || 'Valued Customer',
    billing_last_name: orderData.shipping_address.last_name || '',
    billing_address: orderData.shipping_address.address1 || '',
    billing_address_2: orderData.shipping_address.address2 || '',
    billing_city: orderData.shipping_address.city || 'Nagpur',
    billing_pincode: orderData.shipping_address.zip || '',
    billing_state: orderData.shipping_address.province || 'Maharashtra',
    billing_country: orderData.shipping_address.country || 'India',
    billing_email: orderData.email || 'customer@lushbeautymart.com',
    billing_phone: orderData.shipping_address.phone || orderData.phone || '',
    shipping_is_billing: true,
    order_items: (orderData.line_items || []).map(item => ({
      name: item.title || 'Beauty Product',
      sku: item.sku || `LUSH-${item.id}`,
      units: item.quantity || 1,
      selling_price: parseFloat(item.price || '0'),
      discount: 0,
      tax: 0,
    })),
    payment_method: isPrepaid ? 'Prepaid' : 'COD',
    sub_total: parseFloat(orderData.total_price || '0'),
    length: 15,
    breadth: 10,
    height: 10,
    weight: parseFloat(orderData.total_weight || 500) / 1000, // in kg
  };

  try {
    const srRes = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const srData = await srRes.json();
    return res.status(srRes.ok ? 200 : 400).json(srData);
  } catch (err) {
    console.error('[Shiprocket Order Creation Error]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
