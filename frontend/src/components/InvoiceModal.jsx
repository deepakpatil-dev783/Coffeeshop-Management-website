import React from "react";
import { Printer, Download, Mail, X, Coffee, CheckCircle } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  const { addToast } = useNotification();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
========================================
         BREW & BEAN COFFEE SHOP        
       482 Artisan Way, SF 94107        
========================================
Order ID      : ${order.orderId || "BB-9000"}
Date & Time   : ${new Date(order.createdAt).toLocaleString()}
Customer      : ${order.customerName}
Table Number  : ${order.tableNumber ? `Table #${order.tableNumber}` : "Takeaway"}
Order Type    : ${order.orderType}
Payment Status: ${order.paymentStatus} (${order.paymentMethod})
----------------------------------------
ITEMS PURCHASED:
${order.items.map((i) => `${i.name} x${i.quantity} @ ₹${i.price.toFixed(2)} = ₹${(i.price * i.quantity).toFixed(2)}`).join("\n")}
----------------------------------------
Subtotal      : ₹${order.subtotal?.toFixed(2)}
Sales Tax (5%): ₹${order.tax?.toFixed(2)}
Discount      : -₹${order.discount?.toFixed(2)}
TOTAL AMOUNT  : ₹${order.totalAmount?.toFixed(2)}
========================================
      Thank you for visiting us!        
        www.brewbean.com               
========================================
    `;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_${order.orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast(`Invoice ${order.orderId} receipt downloaded!`, "success");
  };

  const handleSendEmail = () => {
    addToast(
      `Receipt for ${order.orderId} sent to ${order.customerEmail || "customer@example.com"}!`,
      "success",
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-cream text-coffee-950 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-coffee-200">
        {/* Modal Action Header */}
        <div className="bg-coffee-950 text-coffee-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-lg font-bold">
              Official Invoice & Receipt
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-coffee-800 text-coffee-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Invoice Container */}
        <div
          id="printable-bill"
          className="p-6 space-y-6 text-sm font-sans bg-white"
        >
          {/* Coffee Shop Header */}
          <div className="text-center border-b border-coffee-200 pb-4">
            <h2 className="font-serif text-2xl font-extrabold text-coffee-900 tracking-tight">
              ☕ Brew & Bean
            </h2>
            <p className="text-xs text-coffee-600 font-medium">
              Artisan Coffee & Roastery
            </p>
            <p className="text-[11px] text-coffee-500">
              482 Artisan Way, SF 94107 • Phone: +1 555-BREW-BEAN
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-coffee-50/70 p-3.5 rounded-xl border border-coffee-100">
            <div>
              <p className="text-coffee-500 font-medium">Order ID</p>
              <p className="font-bold text-coffee-900 font-mono">
                {order.orderId}
              </p>
            </div>
            <div>
              <p className="text-coffee-500 font-medium">Date & Time</p>
              <p className="font-semibold text-coffee-900">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-coffee-500 font-medium">Customer</p>
              <p className="font-semibold text-coffee-900">
                {order.customerName}
              </p>
            </div>
            <div>
              <p className="text-coffee-500 font-medium">Table / Type</p>
              <p className="font-semibold text-coffee-900">
                {order.tableNumber ? `Table #${order.tableNumber}` : "Takeaway"}{" "}
                ({order.orderType})
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-coffee-200 text-coffee-600 font-semibold uppercase tracking-wider">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-100 text-coffee-900">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 font-medium">{item.name}</td>
                    <td className="py-2 text-center font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-2 text-right">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-coffee-200 pt-3 space-y-1.5 text-xs text-coffee-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-coffee-900">
                ₹{order.subtotal?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (5%)</span>
              <span>₹{order.tax?.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Promo</span>
                <span>-₹{order.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-coffee-950 border-t border-coffee-300 pt-2">
              <span>Total Paid ({order.paymentMethod || "Card"})</span>
              <span className="text-coffee-800">
                ₹{order.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[11px] text-coffee-500 italic">
            Thank you for choosing Brew & Bean! We hope you loved your coffee.
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="bg-coffee-100 p-4 flex flex-wrap gap-2 justify-between items-center border-t border-coffee-200">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-coffee-900 text-cream text-xs font-semibold hover:bg-coffee-800 transition shadow-sm"
            >
              <Printer className="w-4 h-4 text-gold" /> Print Bill
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-coffee-200 text-coffee-900 text-xs font-semibold hover:bg-coffee-300 transition"
            >
              <Download className="w-4 h-4 text-coffee-700" /> Download Receipt
            </button>
          </div>
          <button
            onClick={handleSendEmail}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition"
          >
            <Mail className="w-4 h-4" /> Send Email
          </button>
        </div>
      </div>
    </div>
  );
};
