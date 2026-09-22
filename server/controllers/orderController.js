import Order from "../models/Order.js";
import { initialOrders } from "./dataStore.js";

let inMemoryOrders = [...initialOrders];

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error("[Order Get Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = `BB-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullOrder = {
      ...orderData,
      orderId,
      createdAt: new Date().toISOString(),
      orderStatus: orderData.orderStatus || "New",
      paymentStatus: orderData.paymentStatus || "Paid",
    };

    const createdOrder = await Order.create(fullOrder);

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: createdOrder,
    });
  } catch (error) {
    console.error("[Order Create Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    let updated = null;
    try {
      const updates = {};
      if (orderStatus) updates.orderStatus = orderStatus;
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      updated = await Order.findOneAndUpdate({ orderId }, updates, {
        new: true,
      });
    } catch (e) {}

    if (!updated) {
      const idx = inMemoryOrders.findIndex((o) => o.orderId === orderId);
      if (idx !== -1) {
        if (orderStatus) inMemoryOrders[idx].orderStatus = orderStatus;
        if (paymentStatus) inMemoryOrders[idx].paymentStatus = paymentStatus;
        updated = inMemoryOrders[idx];
      }
    }

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: `Order ${orderId} updated`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
