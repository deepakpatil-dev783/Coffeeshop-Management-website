import Menu from "../models/Menu.js";
import { initialMenu } from "./dataStore.js";

let inMemoryMenu = [...initialMenu];

export const getMenuItems = async (req, res) => {
  try {
    const items = await Menu.find();
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("[Menu Get Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const newItemData = req.body;
    const createdItem = await Menu.create(newItemData);
    res
      .status(201)
      .json({
        success: true,
        message: "Menu item created successfully",
        data: createdItem,
      });
  } catch (error) {
    console.error("[Menu Create Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Menu.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("[Menu Update Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Menu.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({ success: true, message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("[Menu Delete Error]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
