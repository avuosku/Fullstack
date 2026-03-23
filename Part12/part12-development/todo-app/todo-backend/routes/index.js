const express = require('express');
const router = express.Router();
const redis = require('../redis')

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++
  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  try {
    const addedTodos = await redis.getAsync('added_todos')
    return res.json({ added_todos: parseInt(addedTodos) || 0 })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

module.exports = router;
