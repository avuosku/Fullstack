const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get('/', (req, res) => {
  res.send('Welcome to the Phonebook API');
});

// MongoDB-yhteys
const url = process.env.MONGODB_URI;
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Mongoose-skeema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// GET /api/persons
app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    });
});

// GET /info
app.get("/info", (req, res) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
    });
});

// GET /api/persons/:id
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

// POST /api/persons
app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }

  const person = new Person({ name, number });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});

// PUT /api/persons/:id
app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  const person = { name, number };

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

// DELETE /api/persons/:id
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

// Virheidenkäsittely middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "Malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
