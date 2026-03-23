const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  favoriteGenre: String,
  passwordHash: String
})

module.exports = mongoose.model('User', userSchema)
