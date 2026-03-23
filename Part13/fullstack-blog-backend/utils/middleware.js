const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map(e => e.message) });
  }
  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

module.exports = { errorHandler, unknownEndpoint };
