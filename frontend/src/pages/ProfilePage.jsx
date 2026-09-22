import React, { useState } from "react";
import {
  User,
  ShoppingBag,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useTables } from "../context/TableContext";
import { OrderStatusBadge } from "../components/StatusBadge";
import { InvoiceModal } from "../components/InvoiceModal";

export const ProfilePage = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { reservations } = useTables();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const myOrders = orders.filter(
    (o) =>
      o.customerEmail?.toLowerCase() === user?.email?.toLowerCase() ||
      o.customerName === user?.name,
  );

  const myReservations = reservations.filter(
    (r) =>
      r.customerEmail?.toLowerCase() === user?.email?.toLowerCase() ||
      r.customerName === user?.name,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-coffee-950 text-coffee-100 p-8 rounded-3xl border border-coffee-800 shadow-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          <img
            src={
              user?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            }
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-gold shadow-lg"
          />
          <div>
            <span className="bg-gold/20 text-gold px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {user?.role || "Customer"} Account
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream mt-1">
              {user?.name}
            </h1>
            <p className="text-xs text-coffee-300">
              {user?.email} • {user?.phone || "No phone set"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-coffee-900/90 p-4 rounded-2xl border border-coffee-700 text-center text-xs">
          <div>
            <p className="text-coffee-400 font-medium">Total Orders</p>
            <p className="text-lg font-bold text-gold">{myOrders.length}</p>
          </div>
          <div className="w-px h-8 bg-coffee-800"></div>
          <div>
            <p className="text-coffee-400 font-medium">Table Reservations</p>
            <p className="text-lg font-bold text-gold">
              {myReservations.length}
            </p>
          </div>
          <div className="w-px h-8 bg-coffee-800"></div>
          <div>
            <p className="text-coffee-400 font-medium">Loyalty Points</p>
            <p className="text-lg font-bold text-emerald-400">450 Pts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Orders History Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-coffee-200 pb-2 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-coffee-950 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" /> Order History & Live
              Tracker
            </h3>
          </div>

          {myOrders.length === 0 ? (
            <div className="bg-cream p-8 rounded-3xl border border-coffee-200 text-center text-coffee-600 text-sm">
              No previous orders found for this account.
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((ord) => (
                <div
                  key={ord.orderId || ord.id}
                  className="bg-cream p-5 rounded-3xl border border-coffee-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-coffee-100 pb-3">
                    <div>
                      <span className="font-bold font-mono text-sm text-coffee-900">
                        {ord.orderId}
                      </span>
                      <span className="text-xs text-coffee-500 ml-2">
                        ({new Date(ord.createdAt).toLocaleString()})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={ord.orderStatus} />
                      <button
                        onClick={() => setSelectedInvoice(ord)}
                        className="px-3 py-1 bg-coffee-900 text-gold text-xs font-bold rounded-lg hover:bg-coffee-800 transition"
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>

                  {/* Order Progress Visual Step */}
                  <div className="bg-coffee-950/90 text-coffee-200 p-3 rounded-2xl border border-coffee-800 text-xs flex items-center justify-between">
                    <span className="text-coffee-400 font-medium">
                      Order Status Tracker:
                    </span>
                    <div className="flex items-center gap-1 font-bold text-gold">
                      {[
                        "New",
                        "Confirmed",
                        "Preparing",
                        "Ready",
                        "Completed",
                      ].map((s, idx) => (
                        <span
                          key={s}
                          className={`px-2 py-0.5 rounded ${ord.orderStatus === s ? "bg-gold text-coffee-950" : "text-coffee-600"}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1 text-xs text-coffee-800">
                    {ord.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between font-medium"
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold text-coffee-950 border-t border-coffee-100 pt-2">
                    <span>Total ({ord.paymentMethod})</span>
                    <span className="text-base text-coffee-900">
                      ₹{ord.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Reservations Sidebar */}
        <div className="space-y-6">
          <div className="border-b border-coffee-200 pb-2">
            <h3 className="font-serif text-xl font-bold text-coffee-950 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" /> My Table Reservations
            </h3>
          </div>

          {myReservations.length === 0 ? (
            <div className="bg-cream p-6 rounded-3xl border border-coffee-200 text-center text-coffee-600 text-xs">
              No active table reservations.
            </div>
          ) : (
            <div className="space-y-3">
              {myReservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-cream p-4 rounded-2xl border border-coffee-200 text-xs space-y-2"
                >
                  <div className="flex justify-between font-bold text-coffee-900">
                    <span>Table #{res.tableNumber}</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {res.status}
                    </span>
                  </div>
                  <p className="text-coffee-600">
                    Date: {res.date} at {res.time}
                  </p>
                  <p className="text-coffee-600">
                    Party Size: {res.guests} Guests
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
