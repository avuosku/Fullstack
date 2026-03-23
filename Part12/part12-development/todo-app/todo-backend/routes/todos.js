const express = require('express');
const { Todo } = require('../mongo');
const router = express.Router();
const { getAsync, setAsync } = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  });
  const addedTodos = await redis.getAsync('added_todos')
  console.log('addedTodos', addedTodos)
  let count =  parseInt(addedTodos, 10)
  if (isNaN(count)) {
    count = 0;
  } 
  count = count+1;
  console.log('count', count.toString())
  await redis.setAsync('added_todos', count.toString())
  res.send(todo);
});


const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);
  next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  try {
    req.todo.text = req.body.text ?? req.todo.text;
    req.todo.done = req.body.done ?? req.todo.done;

    const updated = await req.todo.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
