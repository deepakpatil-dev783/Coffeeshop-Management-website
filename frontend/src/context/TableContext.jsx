import React, { createContext, useContext, useState, useEffect } from 'react';
import { tableService, reservationService } from '../services/api';
import { useNotification } from './NotificationContext';

const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const { addToast } = useNotification();
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tData, rData] = await Promise.all([tableService.getAll(), reservationService.getAll()]);
      setTables(tData);
      setReservations(rData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateTableStatus = async (tableNumber, status) => {
    try {
      const updated = await tableService.updateStatus(tableNumber, status);
      setTables((prev) =>
        prev.map((t) => (t.tableNumber === Number(tableNumber) ? { ...t, status } : t))
      );
      addToast(`Table #${tableNumber} is now marked as "${status}"`, 'info');
    } catch (e) {
      addToast('Failed to update table status', 'error');
    }
  };

  const createReservation = async (reservationData) => {
    try {
      const newRes = await reservationService.create(reservationData);
      setReservations((prev) => [newRes, ...prev]);
      
      // Auto-update table status to Reserved
      await updateTableStatus(reservationData.tableNumber, 'Reserved');
      addToast(`Table #${reservationData.tableNumber} reserved for ${reservationData.customerName}!`, 'success');
      return newRes;
    } catch (e) {
      addToast('Failed to complete reservation', 'error');
      throw e;
    }
  };

  return (
    <TableContext.Provider
      value={{
        tables,
        reservations,
        loading,
        updateTableStatus,
        createReservation,
        refreshTables: loadData
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTables = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTables must be used within a TableProvider');
  }
  return context;
};
