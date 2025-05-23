const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

// Yhdistetään MongoDB:hen
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: [3, 'Name must be at least 3 characters long']
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
          return /^(\d{2,3})-(\d{5,})$/.test(value);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
