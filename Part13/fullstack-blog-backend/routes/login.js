const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  // Luo token vasta tämän jälkeen
  const userForToken = {
    username: user.username,
    id: user.id
  };

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
