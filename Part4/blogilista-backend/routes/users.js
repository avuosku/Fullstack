const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const tokenExtractor = require('../middleware/tokens'); // Oletetaan, että tämä middleware on käytössä

const router = express.Router();

// GET: Hae kaikki käyttäjät (ilman salasanaa)
router.get('/', async (req, res) => {
  console.log('GET request to fetch all users');
  try {
    const users = await User.find({}).select('username name email');
    console.log('Users fetched:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST: Luo uusi käyttäjä
router.post('/', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  body('email').isEmail().withMessage('Invalid email format')
], async (req, res) => {
  console.log('POST request to create a new user:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, password, email } = req.body;

  try {
    // Tarkistetaan, onko käyttäjänimi tai sähköposti jo käytössä
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log('User or email already exists');
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Salasanan hashays
    const passwordHash = await bcrypt.hash(password, 10);

    // Uuden käyttäjän tallennus
    const user = new User({
      username,
      name,
      passwordHash,
      email,
    });

    await user.save();
    console.log('User created successfully:', user);
    res.status(201).json({ message: 'User created successfully', user: { username, name, email } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT: Päivitä käyttäjän tiedot (salasana voidaan päivittää erikseen)
router.put('/:id', [
  body('username').optional().trim().notEmpty().withMessage('Username cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
], async (req, res) => {
  console.log(`PUT request to update user with ID: ${req.params.id}`);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.log('Invalid user ID');
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, email, password } = req.body;

  try {
    // Jos salasana on annettu, hashataan se
    let passwordHash;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        name,
        email,
        passwordHash: password ? passwordHash : undefined, // Ei päivitetä salasanaa, jos ei ole annettu
      },
      { new: true, runValidators: true, context: 'query' }
    ).select('username name email');

    if (!updatedUser) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE: Poista käyttäjä ID:n perusteella (valtuutus adminille tai käyttäjän omat tiedot)
router.delete('/:id', tokenExtractor, async (req, res) => {
  console.log(`DELETE request for user with ID: ${req.params.id}`);
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    console.log('Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (decodedToken.id !== req.params.id) {
    console.log('Unauthorized attempt to delete another user');
    return res.status(403).json({ error: 'You are not authorized to delete this user' });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.log('Invalid user ID');
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User deleted successfully');
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
