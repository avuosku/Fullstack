const router = require('express').Router();
const { ReadingList } = require('../models');
const userExtractor = require('../utils/userExtractor');

// Lisää lukulistalle
router.post('/', userExtractor, async (req, res) => {
  const { blog_id, user_id } = req.body;
  if (req.user.id !== user_id) return res.status(401).json({ error: 'Unauthorized' });
  const entry = await ReadingList.create({ blog_id, user_id });
  res.status(201).json(entry);
});

// Merkkaa luetuksi
router.put('/:id', userExtractor, async (req, res) => {
  const entry = await ReadingList.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Reading list entry not found' });
  if (entry.user_id !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });
  entry.read = req.body.read;
  await entry.save();
  res.json(entry);
});

module.exports = router;
