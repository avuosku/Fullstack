const express = require('express');
require('express-async-errors');
const app = express();

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const readingListsRouter = require('./controllers/readinglists');
const authorsRouter = require('./controllers/authors');
const logoutRouter = require('./controllers/logout');

const middleware = require('./utils/middleware');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/readinglists', readingListsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/logout', logoutRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
