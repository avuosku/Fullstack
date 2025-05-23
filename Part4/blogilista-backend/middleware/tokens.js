// middleware/tokens.js
const jwt = require('jsonwebtoken');


const tokenExtractor = (req, res, next) => {
  const authorization = req.get('Authorization');
  console.log('Authorization header:', authorization); // Debugging

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  } else {
    req.token = null;
  }

  if (!req.token) {
    console.log('⚠️ Token puuttuu');
    return res.status(401).json({ error: 'Token missing' });
  }
  next();
 
};

module.exports = { tokenExtractor };
