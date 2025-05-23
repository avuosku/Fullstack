const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Usage: node mongo.js Ch47.Gp7 [name] [number]');
    process.exit(1);
}

const password = encodeURIComponent(process.argv[2]); // Salasana enkoodattu
const url = `mongodb+srv://avuosku:${password}@puhelinluettelontietoka.m4gaz.mongodb.net/?retryWrites=true&w=majority&appName=Puhelinluettelontietokanta`;

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    // Listaa kaikki kannassa olevat henkilöt
    Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(person => console.log(`${person.name} ${person.number}`));
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    // Lisää uusi henkilö
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(() => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log('Invalid number of arguments.');
    mongoose.connection.close();
}
