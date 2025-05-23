const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// HAE KAIKKI BLOGIT
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

// LUO UUSI BLOGI
blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: [],
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
    username: 1,
    name: 1,
  });

  response.status(201).json(populatedBlog);
});

// PÄIVITÄ BLOGI (esim. tykkäykset)
blogsRouter.put('/:id', async (request, response) => {
  const updated = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('user', { username: 1, name: 1 });
  response.json(updated);
});

// POISTA BLOGI
blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).end();

  await blog.deleteOne();
  response.status(204).end();
});

// 🔧 KOMMENTIN LISÄYS
blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  // Alusta comments-taulukko jos puuttuu
  if (!blog.comments) {
    blog.comments = [];
  }

  blog.comments = blog.comments.concat(comment);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
