const listHelper = require('../utils/list_helper');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const helper = require('./test_helper');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });
const debug = require('debug')('app');

let token = '';

beforeAll(async () => {
  jest.setTimeout(20000);
  console.log('Connecting to:', process.env.TEST_MONGODB_URI);
  try {
    await mongoose.connect(process.env.TEST_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
});

beforeEach(async () => {
  console.log('Clearing database...');
  try {
    await Promise.all([Blog.deleteMany({}), User.deleteMany({})]);
    console.log('Database cleared.');
  } catch (error) {
    console.error('Error while clearing database:', error);
  }

  await Blog.insertMany(helper.initialBlogs);

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({
    username: 'root',
    name: 'Existing user',
    passwordHash,
    email: 'validuser@example.com',
  });
  await user.save();

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' });

  console.log('Login response:', loginResponse.body); // Debugging login response

  if (loginResponse.body.token) {
    token = loginResponse.body.token;
  } else {
    throw new Error('Login failed, token not received.');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

test('total likes of all blogs', () => {
  const result = listHelper.totalLikes(helper.initialBlogs);
  expect(result).toBe(36);
});

test('blog with most likes', () => {
  const result = listHelper.favoriteBlog(helper.initialBlogs);
  expect(result).toEqual(
    expect.objectContaining({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  );
});

test('author with most blogs', () => {
  const result = listHelper.mostBlogs(helper.initialBlogs);
  expect(result).toEqual({
    author: 'Robert C. Martin',
    blogs: 3,
  });
});

test('author with most likes', () => {
  const result = listHelper.mostLikes(helper.initialBlogs);
  expect(result).toEqual({
    author: 'Edsger W. Dijkstra',
    likes: 17,
  });
});

test('should return blogs in JSON format', async () => {
  debug('Pyydetään blogeja API:sta');
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('should return blogs with field "id"', async () => {
  const response = await api.get('/api/blogs');
  debug('Vastaanotettu blogivastaus:', response.body);
  expect(response.body[0].id).toBeDefined();
});

test('adds a new blog', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.title).toBe(newBlog.title);
});

test('should set likes to 0 if not provided', async () => {
  const newBlogWithoutLikes = {
    title: 'Blog Without Likes',
    author: 'No Likes',
    url: 'http://nolikes.com',
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutLikes)
    .expect(201);

  expect(response.body.likes).toBe(0);
});

test('should return 400 if title or url is missing', async () => {
  // 1. Kirjaudu sisään ja hanki token
  const userLogin = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password' });

  const token = userLogin.body.token;

  // 2. Lähetä virheellinen blogi autentikoidulla pyynnöllä
  const newBlog = { author: 'Missing Fields' };
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)  // Lähetetään JWT token
    .send(newBlog)
    .expect(400);
});

test('deletes a blog', async () => {
  // 1. Luo testiblogi ensin
  const newBlog = {
    title: 'Test Blog Delete',
    author: 'Test Author',
    url: 'http://test.com',
  };
  console.log("creation blog for delete");
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  console.log(response);
  // 2. Poista juuri luotu blogi
  await api
    .delete(`/api/blogs/${response.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);
});

test('updates the likes of a blog', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedBlog = {
      ...blogToUpdate,
      likes: 8  // Oletetaan, että uusi arvo on 8
  };

  const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200) // Varmistaa, että päivitys onnistuu

  console.log(response.body); // Debuggaa vastausta

  expect(response.body.likes).toBe(updatedBlog.likes);
});

test('User cannot be created with too short a password', async () => {
  const newUser = {
    username: 'shortpass',
    name: 'Short Pass',
    password: '12',
    email: 'validuser@example.com',
  };
  debug('Lähetetään käyttäjä, jonka salasana on liian lyhyt');
  await api.post('/api/users').send(newUser).expect(400);
});

test('Username must be unique', async () => {
  const newUser = {
    username: 'root',
    name: 'Existing User',
    password: 'password123',
    email: 'validuser@example.com',
  };
  debug('Lähetetään käyttäjä, jolla on jo olemassa oleva käyttäjänimi');
  await api.post('/api/users').send(newUser).expect(400);
});

test('User creation succeeds', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'secretpassword',
    email: 'testuser@example.com',
  };

  debug('Lähetetään käyttäjäluontipyyntö:', newUser);
  const response = await api.post('/api/users').send(newUser);
  expect(response.status).toBe(201);
  expect(response.body.username).toBe(newUser.username);
});

test('User cannot be created with missing fields', async () => {
  const newUser = {
    username: 'missingemailuser',
    name: 'Missing Email User',
    password: 'password123',
    email: '',
  };

  debug('Lähetetään käyttäjä ilman sähköpostia:', newUser);
  const response = await api.post('/api/users').send(newUser);

  console.log(response.body.error);
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('All fields are required: username, name, email, password');
});

test('User cannot be created with invalid email format', async () => {
  const newUser = {
    username: 'invalidemailuser',
    name: 'Invalid Email User',
    password: 'password123',
    email: 'invalidemail.com',
  };

  debug('Lähetetään käyttäjä virheellisellä sähköpostilla:', newUser);
  const response = await api.post('/api/users').send(newUser);

  console.log(response.body.error);
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('Invalid e-mail');
});

test('User cannot be created with password less than 3 characters', async () => {
  const newUser = {
    username: 'shortpass',
    name: 'Short Pass',
    password: '12',
    email: 'validuser@example.com',
  };

  debug('Lähetetään käyttäjä, jonka salasana on liian lyhyt');
  const response = await api.post('/api/users').send(newUser);
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('Password must be at least 3 characters long');
});

test('User creation succeeds with valid credentials and email', async () => {
  const newUser = {
    username: 'newuser123',
    name: 'New User',
    email: 'test@example.com',
    password: 'strongpassword123'
  };

  const response = await api
    .post('/api/users')
    .set('Content-Type', 'application/json') // Varmistaa JSON-muodon
    .send(newUser);

  // Tarkistetaan virheelliset kentät ja virheviestit
  console.log(response.body); // Tämä auttaa tarkistamaan virheen syyt

  expect(response.status).toBe(201);
  expect(response.body.username).toBe(newUser.username);
  expect(response.body.email).toBe(newUser.email);
});

