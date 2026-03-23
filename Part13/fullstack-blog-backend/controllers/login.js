const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User, Session } = require('../models');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  if (user.disabled) {
    return res.status(403).json({ error: 'account disabled' });
  }

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user.id
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  // Tallennetaan token sessions-tauluun
  await Session.create({
    userId: user.id,
    token
  });

  res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
