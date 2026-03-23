const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, Blog, ReadingList } = require('../models');

// Luo uusi käyttäjä
router.post('/', async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    if (!password || password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, username, passwordHash });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Hae kaikki käyttäjät
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Päivitä käyttäjän nimi username:lla
router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = req.body.name;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Hae käyttäjä id:llä ja sen readings
router.get('/:id', async (req, res) => {
  const where = {};
  if (req.query.read === 'true') where.read = true;
  if (req.query.read === 'false') where.read = false;

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'author', 'title', 'url', 'likes', 'year'],
        through: {
          model: ReadingList,
          attributes: ['read'],
          where: Object.keys(where).length ? where : undefined
        }
      }
    ]
  });

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user);
});

module.exports = router;
