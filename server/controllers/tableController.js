import Table from "../models/Table.js";
import { initialTables } from "./dataStore.js";

let inMemoryTables = [...initialTables];

export const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    console.error("[Table Get Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTableStatus = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const { status } = req.body;

    const table = await Table.findOneAndUpdate(
      { tableNumber: Number(tableNumber) },
      { status },
      { new: true },
    );

    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    res.json({
      success: true,
      message: `Table #${tableNumber} status updated to ${status}`,
      data: table,
    });
  } catch (error) {
    console.error("[Table Update Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
