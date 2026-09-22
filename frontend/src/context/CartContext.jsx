import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { addToast } = useNotification();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('brew_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('brew_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.menuItemId === (product.id || product._id));
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          menuItemId: product.id || product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
          category: product.category
        }
      ];
    });
    addToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.menuItemId !== itemId));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.menuItemId === itemId ? { ...i, quantity: newQty } : i))
    );
  };

  const applyCoupon = (code) => {
    if (code.trim().toUpperCase() === 'BREW10') {
      setCouponCode('BREW10');
      setDiscountPercent(10);
      addToast('Promo coupon BREW10 applied! (10% OFF)', 'success');
      return true;
    } else if (code.trim().toUpperCase() === 'VIP20') {
      setCouponCode('VIP20');
      setDiscountPercent(20);
      addToast('VIP Special Coupon Applied! (20% OFF)', 'success');
      return true;
    } else {
      addToast('Invalid coupon code. Try "BREW10"', 'error');
      return false;
    }
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * discountPercent) / 100;
  const tax = (subtotal - discount) * 0.05; // 5% Sales Tax
  const totalAmount = subtotal - discount + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        couponCode,
        discountPercent,
        subtotal,
        discount,
        tax,
        totalAmount,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
