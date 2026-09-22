import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { JWT_SECRET } from '../middleware/auth.js';

// In-memory demo users fallback
const demoUsers = [
  { id: 'u1', name: 'Sophia Reynolds', email: 'customer@brewbean.com', passwordHash: bcrypt.hashSync('customer123', 8), role: 'customer', phone: '+1 555-0192' },
  { id: 'u2', name: 'Marcus Vance', email: 'staff@brewbean.com', passwordHash: bcrypt.hashSync('staff123', 8), role: 'staff', phone: '+1 555-8832' },
  { id: 'u3', name: 'Eleanor Vance (Owner)', email: 'admin@brewbean.com', passwordHash: bcrypt.hashSync('admin123', 8), role: 'owner', phone: '+1 555-9900' }
];

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    let existingUser = null;
    try {
      existingUser = await User.findOne({ email });
    } catch (e) {}

    if (existingUser || demoUsers.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRole = role || 'customer';

    let newUserObj = null;
    try {
      newUserObj = await User.create({ name, email, password: hashedPassword, phone, role: userRole });
    } catch (e) {
      newUserObj = { id: `u_${Date.now()}`, name, email, passwordHash: hashedPassword, phone, role: userRole };
      demoUsers.push(newUserObj);
    }

    const token = jwt.sign({ id: newUserObj._id || newUserObj.id, email, role: userRole, name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: newUserObj._id || newUserObj.id, name, email, role: userRole, phone }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    let user = null;
    try {
      user = await User.findOne({ email });
    } catch (e) {}

    if (!user) {
      const demoMatch = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (demoMatch && bcrypt.compareSync(password, demoMatch.passwordHash)) {
        user = demoMatch;
      }
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) user = null;
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const userId = user._id || user.id;
    const token = jwt.sign({ id: userId, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
