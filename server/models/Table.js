import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'Reserved', 'Occupied', 'Cleaning'], 
    default: 'Available' 
  },
  section: { type: String, default: 'Indoor Main Floor' },
  createdAt: { type: Date, default: Date.now }
});

const Table = mongoose.model('Table', tableSchema);
export default Table;
