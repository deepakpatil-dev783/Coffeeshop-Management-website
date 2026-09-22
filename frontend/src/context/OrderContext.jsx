import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderService } from '../services/api';
import { useNotification } from './NotificationContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { addToast } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (orderData) => {
    try {
      const newOrder = await orderService.create(orderData);
      setOrders((prev) => [newOrder, ...prev]);
      addToast(`Order ${newOrder.orderId} placed successfully!`, 'success');
      return newOrder;
    } catch (e) {
      addToast('Failed to place order. Please try again.', 'error');
      throw e;
    }
  };

  const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      const updated = await orderService.updateStatus(orderId, orderStatus, paymentStatus);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, ...updated } : o))
      );
      addToast(`Order ${orderId} status updated to "${orderStatus}"!`, 'info');
    } catch (e) {
      addToast('Error updating order status', 'error');
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders, createOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
