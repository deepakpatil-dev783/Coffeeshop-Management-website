import React from 'react';
import { Users, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { TableStatusBadge } from './StatusBadge';

export const TableLayout = ({ tables, selectedTable, onSelectTable, isStaff = false, onUpdateStatus }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-coffee-900 text-coffee-100 p-4 rounded-2xl border border-coffee-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <h4 className="font-serif font-bold text-base">Interactive Floor Plan Layout</h4>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Available</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Reserved</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Occupied</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Cleaning</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => {
          const isSelected = selectedTable === table.tableNumber;
          return (
            <div
              key={table.tableNumber}
              onClick={() => onSelectTable && onSelectTable(table.tableNumber)}
              className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between h-44 ${
                isSelected
                  ? 'bg-gold/20 border-gold shadow-gold-glow scale-102 ring-2 ring-gold'
                  : table.status === 'Available'
                  ? 'bg-cream hover:bg-emerald-50/50 border-emerald-500/30 hover:border-emerald-500'
                  : table.status === 'Reserved'
                  ? 'bg-amber-50/60 border-amber-500/30'
                  : table.status === 'Occupied'
                  ? 'bg-rose-50/60 border-rose-500/30'
                  : 'bg-blue-50/60 border-blue-500/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-serif font-extrabold text-xl text-coffee-950">
                  Table #{table.tableNumber}
                </span>
                <TableStatusBadge status={table.status} />
              </div>

              {/* Table Visualization Box */}
              <div className="my-2 flex items-center justify-center">
                <div
                  className={`w-20 h-14 rounded-2xl flex items-center justify-center gap-1 border-2 font-bold text-xs ${
                    table.status === 'Available'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : table.status === 'Reserved'
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : table.status === 'Occupied'
                      ? 'bg-rose-100 border-rose-300 text-rose-900'
                      : 'bg-blue-100 border-blue-300 text-blue-900'
                  }`}
                >
                  <Users className="w-4 h-4 opacity-70" />
                  <span>{table.capacity} Seats</span>
                </div>
              </div>

              {/* Footer / Controls */}
              <div className="flex items-center justify-between text-xs text-coffee-600 border-t border-coffee-200/60 pt-2">
                <span className="truncate max-w-[100px] text-[11px] font-medium text-coffee-500">{table.section}</span>
                {isStaff && onUpdateStatus && (
                  <select
                    value={table.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdateStatus(table.tableNumber, e.target.value)}
                    className="text-[11px] font-bold rounded-lg border border-coffee-300 bg-white px-1.5 py-0.5 text-coffee-900 shadow-xs focus:ring-1 focus:ring-gold"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
