require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// --- 1. MIDDLEWARE ---
app.use(express.json()); // Allow JSON data
app.use(cors()); // Allow React to talk to this server

// --- 2. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reportassist')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- 3. USER MODEL (Schema) ---
const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// --- 4. ROUTES ---

// SIGNUP ROUTE
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to DB
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Create Token
    const token = jwt.sign({ id: newUser._id }, "SECRET_KEY_123", { expiresIn: "1h" });

    // ✅ UPDATED: Now sending lastName back after signup
    res.status(201).json({ 
      message: "User created successfully", 
      token, 
      user: { 
        firstName, 
        lastName, // <--- Added this
        email 
      } 
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create Token
    const token = jwt.sign({ id: user._id }, "SECRET_KEY_123", { expiresIn: "1h" });

    // ✅ UPDATED: Now sending lastName back after login
    res.json({ 
      message: "Login successful", 
      token, 
      user: { 
        firstName: user.firstName, 
        lastName: user.lastName, // <--- Added this
        email: user.email 
      } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// --- 5. START SERVER ---
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));