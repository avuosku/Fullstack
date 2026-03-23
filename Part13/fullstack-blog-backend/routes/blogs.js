const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.getAll()
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = blogsRouter
