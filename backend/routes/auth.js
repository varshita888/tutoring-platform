const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// ── REGISTER ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill in all fields' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: 'An account with this email already exists' });

    // Hash password directly here
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user with hashed password
    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase(),
      password: hashedPassword
    });

    console.log('✅ New user registered:', user.email);

    return res.status(201).json({
      message: 'Account created successfully'
    });

  } catch (err) {
    console.error('❌ Register error:', err.message);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ── LOGIN ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please enter email and password' });

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: 'No account found with this email' });

    // Compare password directly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect password' });

    console.log('✅ User logged in:', user.email);

    return res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ── PROFILE ───────────────────────────────────────────────
router.get('/profile', protect, (req, res) => {
  return res.json(req.user);
});

module.exports = router;