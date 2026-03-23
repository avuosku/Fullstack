const jwt = require('jsonwebtoken');
const { User } = require('../models');

const userExtractor = (strict = false) => async (req, res, next) => {
  const auth = req.get('authorization');
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
    if (strict) return res.status(401).json({ error: 'token missing or invalid' });
    return next();
  }

  const token = auth.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user && strict) return res.status(401).json({ error: 'user not found' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = userExtractor;
