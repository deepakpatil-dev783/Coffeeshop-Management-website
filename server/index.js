import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import Menu from "./models/Menu.js";
import Table from "./models/Table.js";
import Reservation from "./models/Reservation.js";
import Order from "./models/Order.js";
import Payment from "./models/Payment.js";

import {
  initialMenu,
  initialTables,
  initialReservations,
  initialOrders,
} from "./controllers/dataStore.js";

import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const seedCollection = async (Model, seedData, label) => {
  try {
    const count = await Model.countDocuments();
    if (count === 0 && seedData?.length) {
      await Model.insertMany(seedData);
      console.log(`[Seed] ${label} seeded (${seedData.length} records)`);
    } else {
      console.log(`[Seed] ${label} already has ${count} records`);
    }
  } catch (error) {
    console.warn(`[Seed Warning] ${label}: ${error.message}`);
  }
};

const seedDatabase = async () => {
  await seedCollection(Menu, initialMenu, "Menu");
  await seedCollection(Table, initialTables, "Tables");
  await seedCollection(Reservation, initialReservations, "Reservations");
  await seedCollection(Order, initialOrders, "Orders");

  const samplePayments = [
    {
      orderId: "BB-9041",
      amount: 16.24,
      paymentMethod: "Credit Card",
      transactionId: "TXN-SEED-001",
      customerName: "Sophia Reynolds",
      status: "Completed",
      createdAt: new Date().toISOString(),
    },
  ];

  await seedCollection(Payment, samplePayments, "Payments");
};

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`☕ Brew & Bean Server running on http://localhost:${PORT}`);
  });
};

startServer();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    system: "Brew & Bean Backend API",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Error Handler]", err.stack);
  res
    .status(500)
    .json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
});
