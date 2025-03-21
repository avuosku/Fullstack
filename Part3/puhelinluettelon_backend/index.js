const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Phonebook API');
});

app.get("/info", (req, res) => {
    const info = `Phonebook has info for ${persons.length} people`;
    const time = new Date();
    res.send(`<p>${info}</p><p>${time}</p>`);
  });

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
  
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ error: "Person not found" });
    }
  });

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
})

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  morgan.token("body", (req) => JSON.stringify(req.body));
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

  if (!name || !number) {
      return res.status(400).json({ error: "Name or number is missing" });
  }

  if (persons.some(p => p.name === name)) {
      return res.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
      id: Math.floor(Math.random() * 1000000),
      name,
      number,
  };

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
