const jwt = require('jsonwebtoken');
const { User, Session } = require('../models');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' });
  }

  const token = authorization.substring(7);

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    const session = await Session.findOne({ where: { token } });
    if (!session) {
      return res.status(401).json({ error: 'session expired or invalid' });
    }

    const user = await User.findByPk(decodedToken.id);
    if (!user || user.disabled) {
      return res.status(403).json({ error: 'account disabled or deleted' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'invalid token' });
  }
};

module.exports = tokenExtractor;
