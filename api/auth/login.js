module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (email === 'owner@ruchicoet.com' && password === 'ruchi2026') {
      return res.json({ token: 'demo-admin-token' });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
