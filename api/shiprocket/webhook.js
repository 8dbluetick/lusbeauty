/**
 * Lush Beauty Mart — Shiprocket Tracking Webhook Handler
 * Receives shipment tracking status updates from Shiprocket
 */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Shiprocket webhook payload
  const payload = req.body;

  if (!payload || !payload.shipment_id) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  const {
    shipment_id,
    order_id,
    current_status,
    awb,
    courier_name,
    scans = [],
    etd,
  } = payload;

  console.log(`[Shiprocket Webhook] Order #${order_id} (AWB: ${awb}) status: ${current_status}`);

  // In production, update order fulfillment tracking in database / Shopify Admin API
  // Map Shiprocket status codes:
  // 6: 'SHIPPED', 7: 'DELIVERED', 8: 'CANCELED', 9: 'RTO INITIATED', 17: 'OUT FOR DELIVERY', etc.

  return res.status(200).json({
    received: true,
    order_id,
    shipment_id,
    status: current_status,
    timestamp: new Date().toISOString(),
  });
};
