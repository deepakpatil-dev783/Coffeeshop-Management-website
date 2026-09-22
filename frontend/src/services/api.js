import axios from "axios";
import {
  initialMenuItems,
  initialTablesList,
  initialOrdersList,
  initialReservationsList,
} from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 4000,
});

// Attach Token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("brew_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Local Storage Keys
const STORAGE_KEYS = {
  MENU: "brew_menu_items",
  TABLES: "brew_tables_list",
  ORDERS: "brew_orders_list",
  RESERVATIONS: "brew_reservations_list",
};

const getLocal = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
};

// API Services with Fallbacks
export const menuService = {
  getAll: async () => {
    try {
      const res = await api.get("/menu");
      return res.data.data;
    } catch (e) {
      let local = getLocal(STORAGE_KEYS.MENU, null);
      if (!local) {
        local = initialMenuItems;
        setLocal(STORAGE_KEYS.MENU, local);
      }
      return local;
    }
  },
  create: async (item) => {
    try {
      const res = await api.post("/menu", item);
      return res.data.data;
    } catch (e) {
      const local = getLocal(STORAGE_KEYS.MENU, initialMenuItems);
      const newItem = { ...item, id: `m_${Date.now()}` };
      const updated = [newItem, ...local];
      setLocal(STORAGE_KEYS.MENU, updated);
      return newItem;
    }
  },
  update: async (id, updates) => {
    try {
      const res = await api.put(`/menu/${id}`, updates);
      return res.data.data;
    } catch (e) {
      const local = getLocal(STORAGE_KEYS.MENU, initialMenuItems);
      const updated = local.map((i) =>
        i.id === id || i._id === id ? { ...i, ...updates } : i,
      );
      setLocal(STORAGE_KEYS.MENU, updated);
      return updated.find((i) => i.id === id || i._id === id);
    }
  },
  delete: async (id) => {
    try {
      await api.delete(`/menu/${id}`);
    } catch (e) {
      const local = getLocal(STORAGE_KEYS.MENU, initialMenuItems);
      const updated = local.filter((i) => i.id !== id && i._id !== id);
      setLocal(STORAGE_KEYS.MENU, updated);
    }
  },
};

export const tableService = {
  getAll: async () => {
    try {
      const res = await api.get("/tables");
      return res.data.data;
    } catch (e) {
      let local = getLocal(STORAGE_KEYS.TABLES, null);
      if (!local) {
        local = initialTablesList;
        setLocal(STORAGE_KEYS.TABLES, local);
      }
      return local;
    }
  },
  updateStatus: async (tableNumber, status) => {
    try {
      const res = await api.put(`/tables/${tableNumber}/status`, { status });
      return res.data.data;
    } catch (e) {
      const local = getLocal(STORAGE_KEYS.TABLES, initialTablesList);
      const updated = local.map((t) =>
        t.tableNumber === Number(tableNumber) ? { ...t, status } : t,
      );
      setLocal(STORAGE_KEYS.TABLES, updated);
      return updated.find((t) => t.tableNumber === Number(tableNumber));
    }
  },
};

export const orderService = {
  getAll: async () => {
    try {
      const res = await api.get("/orders");
      return res.data.data;
    } catch (e) {
      let local = getLocal(STORAGE_KEYS.ORDERS, null);
      if (!local) {
        local = initialOrdersList;
        setLocal(STORAGE_KEYS.ORDERS, local);
      }
      return local;
    }
  },
  create: async (orderData) => {
    try {
      const res = await api.post("/orders", orderData);
      return res.data.data;
    } catch (e) {
      const local = getLocal(STORAGE_KEYS.ORDERS, initialOrdersList);
      const orderId = `BB-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        ...orderData,
        orderId,
        id: `ord_${Date.now()}`,
        createdAt: new Date().toISOString(),
        orderStatus: orderData.orderStatus || "New",
        paymentStatus: orderData.paymentStatus || "Paid",
      };
      const updated = [newOrder, ...local];
      setLocal(STORAGE_KEYS.ORDERS, updated);
      return newOrder;
    }
  },
  updateStatus: async (orderId, orderStatus, paymentStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        orderStatus,
        paymentStatus,
      });
      return res.data.data;
    } catch (e) {
      const local = getLocal(STORAGE_KEYS.ORDERS, initialOrdersList);
      const updated = local.map((o) => {
        if (o.orderId === orderId || o.id === orderId) {
          return {
            ...o,
            orderStatus: orderStatus || o.orderStatus,
            paymentStatus: paymentStatus || o.paymentStatus,
          };
        }
        return o;
      });
      setLocal(STORAGE_KEYS.ORDERS, updated);
      return updated.find((o) => o.orderId === orderId || o.id === orderId);
    }
  },
};

export const reservationService = {
  getAll: async () => {
    try {
      const res = await api.get("/reservations");
      return res.data.data;
    } catch (e) {
      let local = getLocal(STORAGE_KEYS.RESERVATIONS, null);
      if (!local) {
        local = initialReservationsList;
        setLocal(STORAGE_KEYS.RESERVATIONS, local);
      }
      return local;
    }
  },
  create: async (resData) => {
    try {
      const res = await api.post("/reservations", resData);
      return res.data.data;
    } catch (e) {
      const local = getLocal(
        STORAGE_KEYS.RESERVATIONS,
        initialReservationsList,
      );
      const newRes = {
        ...resData,
        id: `res_${Date.now()}`,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      };
      const updated = [newRes, ...local];
      setLocal(STORAGE_KEYS.RESERVATIONS, updated);
      return newRes;
    }
  },
  updateStatus: async (id, status) => {
    try {
      const res = await api.put(`/reservations/${id}/status`, { status });
      return res.data.data;
    } catch (e) {
      const local = getLocal(
        STORAGE_KEYS.RESERVATIONS,
        initialReservationsList,
      );
      const updated = local.map((r) =>
        r.id === id || r._id === id ? { ...r, status } : r,
      );
      setLocal(STORAGE_KEYS.RESERVATIONS, updated);
      return updated.find((r) => r.id === id || r._id === id);
    }
  },
};

export const analyticsService = {
  getSummary: async () => {
    try {
      const res = await api.get("/analytics/summary");
      return res.data;
    } catch (e) {
      return {
        summary: {
          totalRevenue: 48920.5,
          totalOrders: 1420,
          totalCustomers: 890,
          averageOrderValue: 34.45,
          todayRevenue: 1845.2,
          monthlyRevenue: 34150.0,
          growthRate: "+18.4%",
          tableUtilizationRate: "78.5%",
        },
        dailyRevenue: [
          { day: "Mon", revenue: 1450, orders: 48 },
          { day: "Tue", revenue: 1680, orders: 52 },
          { day: "Wed", revenue: 1920, orders: 61 },
          { day: "Thu", revenue: 2100, orders: 68 },
          { day: "Fri", revenue: 2850, orders: 94 },
          { day: "Sat", revenue: 3400, orders: 112 },
          { day: "Sun", revenue: 3100, orders: 104 },
        ],
        monthlyRevenue: [
          { month: "Jan", revenue: 28000 },
          { month: "Feb", revenue: 31200 },
          { month: "Mar", revenue: 34500 },
          { month: "Apr", revenue: 32900 },
          { month: "May", revenue: 38400 },
          { month: "Jun", revenue: 41200 },
          { month: "Jul", revenue: 44800 },
          { month: "Aug", revenue: 46200 },
          { month: "Sep", revenue: 48920 },
        ],
        categoryRevenue: [
          { category: "Coffee", value: 42, color: "#6F4227" },
          { category: "Cold Drinks", value: 24, color: "#D4A373" },
          { category: "Snacks", value: 18, color: "#B07D4F" },
          { category: "Desserts", value: 10, color: "#8B5A2B" },
          { category: "Tea", value: 6, color: "#543322" },
        ],
        topSellingProducts: [
          { name: "Caramel Macchiato", sold: 482, revenue: 2646.18 },
          { name: "Iced Cold Brew Vanilla Foam", sold: 395, revenue: 2287.05 },
          { name: "Belgian Chocolate Croissant", sold: 341, revenue: 1531.09 },
          { name: "Velvet Flat White", sold: 298, revenue: 1487.02 },
          { name: "Matcha Green Tea Latte", sold: 215, revenue: 1137.35 },
        ],
        peakHours: [
          { hour: "07:00", orders: 18 },
          { hour: "08:00", orders: 45 },
          { hour: "09:00", orders: 82 },
          { hour: "10:00", orders: 64 },
          { hour: "11:00", orders: 40 },
          { hour: "12:00", orders: 75 },
          { hour: "13:00", orders: 88 },
          { hour: "14:00", orders: 52 },
          { hour: "15:00", orders: 38 },
          { hour: "16:00", orders: 60 },
          { hour: "17:00", orders: 72 },
          { hour: "18:00", orders: 50 },
          { hour: "19:00", orders: 35 },
        ],
        paymentMethods: [
          { name: "Credit Card", percentage: 48 },
          { name: "UPI / QR", percentage: 32 },
          { name: "Apple Pay", percentage: 14 },
          { name: "Cash", percentage: 6 },
        ],
      };
    }
  },
};

export default api;
