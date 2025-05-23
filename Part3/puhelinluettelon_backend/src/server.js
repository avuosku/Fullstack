const http = require("http");
const express = require('express');
const app = express();

const Person = require('./models/person');

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching people');
    });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
