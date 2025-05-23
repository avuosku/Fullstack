const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const User = require('./models/user');
const router = require('./routes/blogs');
const testing = require('./routes/testing');

require('dotenv').config();

const app = express();
const SECRET = process.env.SECRET || 'default-secret-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

console.log("SECRET "+SECRET)
// MongoDB-yhteys
if (process.env.NODE_ENV !== 'test') {
  const mongoURI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI || 'mongodb://localhost:27017/testBloglist';

  console.log(`Connecting to MongoDB at: ${mongoURI}`);

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
}

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Blogireitit
app.use('/api/blogs', router);

app.use('/api/testing',testing)

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

app.post('/api/users', async (req, res, next) => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required: username, name, email, password' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid e-mail' });
  }

  if (password.length < 3) {
    return res.status(400).json({ error: 'Password must be at least 3 characters long' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email must be unique' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, name, email, passwordHash });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Käyttäjän poistaminen
app.delete('/api/users/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    console.log(`Deleting user with ID: ${id}`);
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
});

// Kirjautuminen
app.post('/api/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    console.log("Tarkistetaan "+username);
    const user = await User.findOne({ username }).select('+passwordHash');
    if (!user) {
      console.log("Ei löytynyt käyttäjää");
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    console.log("Tarkistetaan passu");
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' });
    res.status(200).send({ token, username: user.username });
  } catch (error) {
    next(error);
  }
});

const jwtMiddleware = (req, res, next) => {
  const authorization = req.get('authorization');
  const token = authorization && authorization.startsWith('Bearer ')
    ? authorization.substring(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  jwt.verify(token, SECRET, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ error: 'Token invalid or expired' });
    }
    req.user = decodedToken;
    next();
  });
};

app.post('/api/blogs', jwtMiddleware, async (req, res, next) => {
  try {
    const { title, author, url } = req.body;
    if (!title || !author || !url) {
      return res.status(400).json({ error: 'Title, author, and URL are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const blog = new Blog({ title, author, url, user: user._id });
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

// 404 -virhe reitille, jota ei löytynyt
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Keskitetty virheenkäsittely
app.use((error, req, res, next) => {
  console.error('Error:', error.message);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  } else if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformed ID' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
