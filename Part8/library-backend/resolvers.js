const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const { GraphQLError } = require('graphql');

const User = require('./models/user');
const Book = require('./models/book');
const Author = require('./models/author');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const pubsub = new PubSub();

const resolvers = {
  Query: {
    allBooks: async (_, { genre }) => {
      if (genre) {
        return Book.find({ genres: { $in: [genre] } }).populate('author');
      }
      return Book.find({}).populate('author');
    },

    me: (_, __, context) => {
      return context.currentUser;
    },

    allAuthors: async () => {
      return Author.find({});
    },
  },

  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

      if (!user || !passwordCorrect) {
        throw new GraphQLError('Invalid credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { value: token, user };
    },

    createUser: async (_, { username, favoriteGenre, password }) => {
      if (password.length < 6) {
        throw new GraphQLError('Password must be at least 6 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'password'
          }
        });
      }

      const existing = await User.findOne({ username });
      if (existing) {
        throw new GraphQLError('Username must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'username'
          }
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ username, favoriteGenre, passwordHash });

      try {
        return await user.save();
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error
          }
        });
      }
    },

    addBook: async (_, { title, author, published, genres }, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        });
      }

      let authorObj = await Author.findOne({ name: author });
      if (!authorObj) {
        try {
          authorObj = new Author({ name: author });
          await authorObj.save();
        } catch (error) {
          throw new GraphQLError('Creating author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: author,
              error
            }
          });
        }
      }

      const book = new Book({ title, published, genres, author: authorObj._id });

      try {
        await book.save();
        await book.populate('author');
        pubsub.publish('BOOK_ADDED', { bookAdded: book });
        return book;
      } catch (error) {
        throw new GraphQLError('Creating book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: { title, published, genres },
            error
          }
        });
      }
    },

    editAuthor: async (_, { name, setBornTo }, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        });
      }

      const author = await Author.findOne({ name });
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: name
          }
        });
      }

      author.born = setBornTo;

      try {
        return await author.save();
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: setBornTo,
            error
          }
        });
      }
    }
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id });
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
};

module.exports = resolvers;

