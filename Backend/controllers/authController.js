const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Receptionist = require('../models/Receptionist');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedRole = role === 'admin' ? 'admin' : 'receptionist';
  console.log(`Signup attempt: ${email} as ${normalizedRole}`);
  try {
    let user;
    const emailQuery = { email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') } };
    const [adminExisting, receptionistExisting] = await Promise.all([
      Admin.findOne(emailQuery),
      Receptionist.findOne(emailQuery),
    ]);

    if (adminExisting || receptionistExisting) {
      return res.status(400).json({ message: 'Account already exists' });
    }
    if (normalizedRole === 'admin') {
      user = new Admin({ name, email, password });
    } else {
      user = new Receptionist({ name, email, password });
    }
    await user.save();
    console.log(`Signup success: ${email}`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(`Signup error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedRole = role === 'admin' ? 'admin' : role === 'receptionist' ? 'receptionist' : null;
  console.log(`Login attempt: ${email}${normalizedRole ? ` as ${normalizedRole}` : ''}`);
  try {
    let user;
    const query = { email: { $regex: new RegExp(`^${escapeRegex(email)}$`, 'i') } };

    if (normalizedRole === 'admin') {
      user = await Admin.findOne(query);
    } else if (normalizedRole === 'receptionist') {
      user = await Receptionist.findOne(query);
    } else {
      user = await Admin.findOne(query);
      if (!user) {
        user = await Receptionist.findOne(query);
      }
    }

    if (!user) {
      console.log(`Login failed: ${email} NOT FOUND in any collection`);
      return res.status(400).json({ message: 'No account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Invalid password for ${email}`);
      return res.status(400).json({ message: 'Invalid password.' });
    }

    console.log(`Login success: ${email}`);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signup,
  login
};
