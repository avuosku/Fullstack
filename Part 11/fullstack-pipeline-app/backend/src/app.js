const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());

morgan.token("post-data", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    
    const person = new Person({
      name,
      number,
    });
  
    person.save()
      .then(savedPerson => {
        res.json(savedPerson); 
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error saving person');
      });
  });