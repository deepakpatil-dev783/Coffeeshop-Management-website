import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  CreditCard,
  QrCode,
  DollarSign,
  Smartphone,
  Utensils,
  ShoppingBag,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useTables } from "../context/TableContext";
import { useNotification } from "../context/NotificationContext";
import { InvoiceModal } from "../components/InvoiceModal";

export const CheckoutPage = () => {
  const { cart, subtotal, tax, discount, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { tables } = useTables();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [orderType, setOrderType] = useState("Dine-in");
  const [tableNumber, setTableNumber] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableTables = tables.filter(
    (t) =>
      t.status === "Available" ||
      t.status === "Reserved" ||
      t.status === "Occupied",
  );

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      addToast("Please complete all contact details", "warning");
      return;
    }

    if (cart.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    setIsPlacing(true);
    try {
      const orderPayload = {
        customerName,
        customerEmail,
        customerPhone,
        orderType,
        tableNumber: orderType === "Dine-in" ? Number(tableNumber) : null,
        items: cart,
        subtotal,
        tax,
        discount,
        totalAmount,
        paymentMethod,
        paymentStatus: "Paid",
        orderStatus: "New",
      };

      const newOrder = await createOrder(orderPayload);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setPlacedOrder(newOrder);
      setIsModalOpen(true);
      clearCart();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-coffee-200 pb-4">
        <h1 className="font-serif text-3xl font-extrabold text-coffee-950">
          Express Checkout
        </h1>
        <p className="text-xs text-coffee-600 mt-0.5">
          Complete your details to place your coffee order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-cream p-6 rounded-3xl border border-coffee-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-coffee-900 border-b border-coffee-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" /> Customer Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sophia Reynolds"
                  className="w-full bg-white border border-coffee-300 rounded-xl px-4 py-2.5 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="sophia@example.com"
                  className="w-full bg-white border border-coffee-300 rounded-xl px-4 py-2.5 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-coffee-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full bg-white border border-coffee-300 rounded-xl px-4 py-2.5 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dine-in vs Takeaway Selection */}
          <div className="bg-cream p-6 rounded-3xl border border-coffee-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-coffee-900 border-b border-coffee-100 pb-2">
              Order Type & Seating
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOrderType("Dine-in")}
                className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-sm transition ${
                  orderType === "Dine-in"
                    ? "bg-coffee-900 text-gold border-gold shadow-md"
                    : "bg-white border-coffee-200 text-coffee-700 hover:bg-coffee-50"
                }`}
              >
                <Utensils className="w-5 h-5" /> Dine-In Table
              </button>
              <button
                type="button"
                onClick={() => setOrderType("Takeaway")}
                className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-sm transition ${
                  orderType === "Takeaway"
                    ? "bg-coffee-900 text-gold border-gold shadow-md"
                    : "bg-white border-coffee-200 text-coffee-700 hover:bg-coffee-50"
                }`}
              >
                <ShoppingBag className="w-5 h-5" /> Express Takeaway
              </button>
            </div>

            {orderType === "Dine-in" && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-coffee-700 mb-1">
                  Select Table Number
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-white border border-coffee-300 rounded-xl px-4 py-2.5 text-xs text-coffee-950 font-bold focus:ring-2 focus:ring-gold"
                >
                  {tables.map((t) => (
                    <option key={t.tableNumber} value={t.tableNumber}>
                      Table #{t.tableNumber} ({t.capacity} Seats - {t.section} -
                      Status: {t.status})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="bg-cream p-6 rounded-3xl border border-coffee-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-coffee-900 border-b border-coffee-100 pb-2">
              Payment Method
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Credit Card", icon: CreditCard },
                { name: "UPI / QR", icon: QrCode },
                { name: "Apple Pay", icon: Smartphone },
                { name: "Cash", icon: DollarSign },
              ].map((m) => {
                const Icon = m.icon;
                const isSel = paymentMethod === m.name;
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setPaymentMethod(m.name)}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-xs font-bold transition ${
                      isSel
                        ? "bg-coffee-900 text-gold border-gold shadow-md"
                        : "bg-white border-coffee-200 text-coffee-700 hover:bg-coffee-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isSel ? "text-gold" : "text-coffee-600"}`}
                    />
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPlacing || cart.length === 0}
            className="w-full bg-gradient-to-r from-gold to-coffee-400 text-coffee-950 py-4 rounded-2xl font-extrabold text-base shadow-gold-glow hover:brightness-110 transition active:scale-98 disabled:opacity-50"
          >
            {isPlacing
              ? "Processing Order..."
              : `Confirm & Pay ₹${totalAmount.toFixed(2)}`}
          </button>
        </form>

        {/* Order Items Preview Sidebar */}
        <div className="bg-coffee-950 text-coffee-100 p-6 rounded-3xl border border-coffee-800 shadow-2xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-cream border-b border-coffee-800 pb-3">
            Items in Order ({cart.length})
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.menuItemId}
                className="flex items-center gap-3 text-xs border-b border-coffee-900 pb-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 truncate">
                  <p className="font-bold text-cream truncate">{item.name}</p>
                  <p className="text-coffee-400">
                    Qty: {item.quantity} x ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-bold text-gold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-coffee-300 border-t border-coffee-800 pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-cream border-t border-coffee-800 pt-2">
              <span>Total</span>
              <span className="text-gold">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal on Order Success */}
      {placedOrder && (
        <InvoiceModal
          order={placedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            navigate("/profile");
          }}
        />
      )}
    </div>
  );
};
