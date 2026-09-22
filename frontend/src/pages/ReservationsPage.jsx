import React, { useState } from 'react';
import { Calendar, Clock, Users, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { useTables } from '../context/TableContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { TableLayout } from '../components/TableLayout';

export const ReservationsPage = () => {
  const { tables, reservations, createReservation } = useTables();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [selectedTable, setSelectedTable] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:30');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedTable) {
      addToast('Please complete all reservation details', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const resObj = await createReservation({
        customerName,
        customerEmail,
        customerPhone,
        tableNumber: Number(selectedTable),
        date,
        time,
        guests: Number(guests),
        specialRequests
      });
      setSuccessBooking(resObj);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-coffee-950 text-coffee-100 rounded-3xl p-8 sm:p-12 border border-coffee-800 shadow-2xl relative overflow-hidden text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Table Reservation Portal
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-cream">
          Reserve Your Favorite Table
        </h1>
        <p className="text-coffee-300 text-sm max-w-xl mx-auto">
          Choose an ideal seating area—from window bays to private lounge booths—and secure your table in seconds.
        </p>
      </div>

      {successBooking ? (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-8 rounded-3xl text-emerald-100 max-w-2xl mx-auto text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">Table Reserved Successfully!</h2>
          <p className="text-xs text-emerald-200">
            We look forward to welcoming you, <span className="font-bold text-white">{successBooking.customerName}</span>!
          </p>
          <div className="bg-coffee-950 p-4 rounded-2xl border border-emerald-500/30 text-left text-xs space-y-2 text-coffee-200">
            <p><span className="text-coffee-400">Reservation ID:</span> {successBooking.id}</p>
            <p><span className="text-coffee-400">Table Number:</span> Table #{successBooking.tableNumber}</p>
            <p><span className="text-coffee-400">Date & Time:</span> {successBooking.date} at {successBooking.time}</p>
            <p><span className="text-coffee-400">Party Size:</span> {successBooking.guests} Guests</p>
            {successBooking.specialRequests && (
              <p><span className="text-coffee-400">Special Request:</span> {successBooking.specialRequests}</p>
            )}
          </div>
          <button
            onClick={() => setSuccessBooking(null)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Make Another Booking
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Reservation Details Form */}
          <form onSubmit={handleConfirmReservation} className="bg-cream p-6 rounded-3xl border border-coffee-200 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-coffee-950 border-b border-coffee-100 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" /> Booking Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-coffee-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Dr. Michael Vance"
                className="w-full bg-white border border-coffee-300 rounded-xl px-4 py-2 text-xs text-coffee-950 focus:ring-2 focus:ring-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="vance@example.com"
                  className="w-full bg-white border border-coffee-300 rounded-xl px-3 py-2 text-xs text-coffee-950 focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 555-4920"
                  className="w-full bg-white border border-coffee-300 rounded-xl px-3 py-2 text-xs text-coffee-950 focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-coffee-300 rounded-xl px-2 py-2 text-xs font-semibold text-coffee-950"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">Time Slot</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white border border-coffee-300 rounded-xl px-2 py-2 text-xs font-semibold text-coffee-950"
                >
                  {['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-coffee-700 mb-1">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-white border border-coffee-300 rounded-xl px-2 py-2 text-xs font-semibold text-coffee-950"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((g) => (
                    <option key={g} value={g}>{g} Guests</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-coffee-700 mb-1">Selected Table</label>
              <div className="p-3 bg-coffee-900 text-gold font-bold text-xs rounded-xl flex items-center justify-between border border-gold/40">
                <span>Table #{selectedTable} Selected</span>
                <span className="text-[11px] text-coffee-200">
                  Capacity: {tables.find(t => t.tableNumber === Number(selectedTable))?.capacity || 4} Seats
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-coffee-700 mb-1">Special Requests (Optional)</label>
              <textarea
                rows="2"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Quiet corner, high chair needed, anniversary setup"
                className="w-full bg-white border border-coffee-300 rounded-xl px-3 py-2 text-xs text-coffee-950 focus:ring-2 focus:ring-gold"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-gold to-coffee-400 text-coffee-950 py-3.5 rounded-2xl font-extrabold text-sm shadow-gold-glow hover:brightness-110 transition active:scale-98"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Table Reservation'}
            </button>
          </form>

          {/* Interactive Table Layout */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-xl font-bold text-coffee-950">
              Select Table From Interactive Seating Map
            </h3>
            <TableLayout
              tables={tables}
              selectedTable={selectedTable}
              onSelectTable={(tblNum) => setSelectedTable(tblNum)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
