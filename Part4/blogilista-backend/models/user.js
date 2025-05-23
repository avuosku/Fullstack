const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { 
    type: String, 
    required: true, 
    minlength: [3, 'Password must be at least 3 characters long'] 
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Varmistaa, että sähköposti on uniikki
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v); // Sähköpostin validointi
      },
      message: props => `${props.value} ei ole kelvollinen sähköpostiosoite!`
    }
  }
})

module.exports = mongoose.model('User', userSchema)
