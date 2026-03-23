const router = require('express').Router();
const { Blog, User } = require('../models');
const userExtractor = require('../utils/userExtractor');

// Hae kaikki blogit, filtteröinti ja järjestys likejen mukaan
router.get('/', async (req, res) => {
  const search = req.query.search;
  const where = {};
  if (search) {
    where.$or = [
      { title: { $iLike: `%${search}%` } },
      { author: { $iLike: `%${search}%` } }
    ];
  }

  const blogs = await Blog.findAll({
    where,
    include: { model: User, attributes: ['id', 'name', 'username'] },
    order: [['likes', 'DESC']]
  });
  res.json(blogs);
});

// Luo blogi liitettynä tokenin perusteella olevaan käyttäjään
router.post('/', userExtractor, async (req, res) => {
  const blog = await Blog.create({ ...req.body, userId: req.user.id });
  res.status(201).json(blog);
});

// Päivitä blogin likes
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  blog.likes = req.body.likes;
  await blog.save();
  res.json(blog);
});

// Poista blogi (vain omistaja)
router.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  if (blog.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });
  await blog.destroy();
  res.status(204).end();
});

module.exports = router;
