const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { getDB, saveDB } = require('../db');

// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const razorpay = new Razorpay({ 
      key_id: process.env.RAZORPAY_KEY_ID, 
      key_secret: process.env.RAZORPAY_KEY_SECRET 
    });
    const order = await razorpay.orders.create({
      amount: parseInt(req.body.amount) * 100, // paise
      currency: 'INR',
      receipt: 'rcpt_' + Date.now()
    });
    res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payment/verify
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartData } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body).digest('hex');
      
    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
    
    // Save order
    const db = getDB();
    const savedOrder = { 
      id: '#' + crypto.randomBytes(2).toString('hex').toUpperCase(),
      ...cartData, 
      paymentId: razorpay_payment_id,
      paymentMethod: 'razorpay',
      status: 'pending',
      date: new Date().toISOString()
    };
    db.orders.push(savedOrder);
    saveDB(db);
    
    res.json({ success: true, orderId: savedOrder.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
