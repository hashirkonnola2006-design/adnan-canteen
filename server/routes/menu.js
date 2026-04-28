const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../db');
const crypto = require('crypto');

// GET /api/menu
router.get('/', (req, res) => {
  const db = getDB();
  res.json(db.menu.filter(m => m.available !== false));
});

// POST /api/menu (Admin)
router.post('/', (req, res) => {
  const db = getDB();
  const newItem = { 
    _id: crypto.randomUUID(), 
    ...req.body,
    available: true 
  };
  db.menu.push(newItem);
  saveDB(db);
  res.status(201).json(newItem);
});

// PUT /api/menu/:id (Admin)
router.put('/:id', (req, res) => {
  const db = getDB();
  const index = db.menu.findIndex(m => m._id === req.params.id);
  if (index !== -1) {
    db.menu[index] = { ...db.menu[index], ...req.body };
    saveDB(db);
    res.json(db.menu[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// DELETE /api/menu/:id (Admin)
router.delete('/:id', (req, res) => {
  const db = getDB();
  db.menu = db.menu.filter(m => m._id !== req.params.id);
  saveDB(db);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
