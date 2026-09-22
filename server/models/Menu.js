import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Coffee', 'Tea', 'Cold Drinks', 'Snacks', 'Desserts'], 
    required: true 
  },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  availability: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  prepTime: { type: String, default: '5-7 mins' },
  createdAt: { type: Date, default: Date.now }
});

const Menu = mongoose.model('Menu', menuSchema);
export default Menu;
