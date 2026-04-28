const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../db');
const crypto = require('crypto');

// GET /api/orders
router.get('/', (req, res) => {
  const db = getDB();
  let orders = db.orders;
  if (req.query.studentId) {
    orders = orders.filter(o => o.studentId === req.query.studentId);
  }
  // sort by date desc
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(orders);
});

// POST /api/orders
router.post('/', (req, res) => {
  const db = getDB();
  const newOrder = {
    id: '#' + crypto.randomBytes(2).toString('hex').toUpperCase(),
    ...req.body,
    status: req.body.status || 'pending',
    date: new Date().toISOString()
  };
  db.orders.push(newOrder);
  saveDB(db);
  res.status(201).json(newOrder);
});

// PATCH /api/orders/:id
router.patch('/:id', (req, res) => {
  const db = getDB();
  const index = db.orders.findIndex(o => o.id === req.params.id);
  if (index !== -1) {
    db.orders[index].status = req.body.status;
    saveDB(db);
    res.json(db.orders[index]);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', (req, res) => {
  const db = getDB();
  const initialLength = db.orders.length;
  db.orders = db.orders.filter(o => o.id !== req.params.id);
  
  if (db.orders.length < initialLength) {
    saveDB(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

module.exports = router;
