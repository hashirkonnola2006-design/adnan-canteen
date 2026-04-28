const mongoose = require('mongoose');
const crypto = require('crypto');

const OrderSchema = new mongoose.Schema({
  id: { 
    type: String, 
    default: () => '#' + crypto.randomBytes(2).toString('hex').toUpperCase(),
    unique: true
  },
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  items: { type: Object, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentId: { type: String },
  status: { type: String, enum: ['pending','completed','cancelled'], default: 'pending' },
  date: { type: Date, default: Date.now },
  college: { type: String, required: true }
});

module.exports = mongoose.model('Order', OrderSchema);
