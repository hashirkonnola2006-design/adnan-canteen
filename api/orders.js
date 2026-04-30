let orders = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json(orders);
  }

  if (req.method === 'POST') {
    const order = {
      id: Date.now(),
      order_id: Date.now(),
      ...req.body,
      status: req.body.status || 'pending',
      date: new Date().toISOString(),
      qr_scanned: 0
    };
    orders.push(order);
    return res.status(201).json({ message: 'Order created successfully', order_id: order.id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
