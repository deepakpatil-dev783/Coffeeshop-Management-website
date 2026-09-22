import React from 'react';

export const OrderStatusBadge = ({ status }) => {
  const styles = {
    New: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
    Confirmed: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
    Preparing: 'bg-amber-950/80 text-amber-300 border-amber-500/40 animate-pulse',
    Ready: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    Completed: 'bg-gray-800 text-gray-300 border-gray-600',
    Cancelled: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || styles.New
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};

export const TableStatusBadge = ({ status }) => {
  const styles = {
    Available: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    Reserved: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    Occupied: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
    Cleaning: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || styles.Available
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};
