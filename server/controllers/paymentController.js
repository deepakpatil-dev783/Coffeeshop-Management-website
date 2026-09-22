import Payment from '../models/Payment.js';

let inMemoryPayments = [];

export const getPayments = async (req, res) => {
  try {
    let payments = [];
    try {
      payments = await Payment.find().sort({ createdAt: -1 });
    } catch (e) {}

    if (!payments || payments.length === 0) {
      payments = inMemoryPayments;
    }
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, customerName } = req.body;
    const transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const payData = {
      orderId,
      amount,
      paymentMethod,
      transactionId,
      customerName,
      status: 'Completed',
      createdAt: new Date().toISOString()
    };

    let created = null;
    try {
      created = await Payment.create(payData);
    } catch (e) {
      created = { ...payData, id: `pay_${Date.now()}` };
      inMemoryPayments.unshift(created);
    }

    res.status(201).json({
      success: true,
      message: 'Payment completed successfully',
      data: created
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
