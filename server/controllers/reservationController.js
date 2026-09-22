import Reservation from "../models/Reservation.js";
import { initialReservations } from "./dataStore.js";

let inMemoryReservations = [...initialReservations];

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    console.error("[Reservation Get Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReservation = async (req, res) => {
  try {
    const reservationData = req.body;
    const newRes = await Reservation.create(reservationData);

    res.status(201).json({
      success: true,
      message: "Table reservation created successfully!",
      data: newRes,
    });
  } catch (error) {
    console.error("[Reservation Create Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let resItem = null;
    try {
      resItem = await Reservation.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
    } catch (e) {}

    if (!resItem) {
      const idx = inMemoryReservations.findIndex(
        (r) => r.id === id || r._id === id,
      );
      if (idx !== -1) {
        inMemoryReservations[idx].status = status;
        resItem = inMemoryReservations[idx];
      }
    }

    res.json({
      success: true,
      message: `Reservation status updated to ${status}`,
      data: resItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
