const settings = {
  canteen_name: 'Smart Canteen',
  owner_upi: 'hashirkonnola2006@oksbi',
  owner_phone: ''
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json(settings);
  }

  if (req.method === 'POST') {
    Object.assign(settings, req.body);
    return res.json({ message: 'Settings updated' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
