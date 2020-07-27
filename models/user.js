// User model goes here
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  passwordHashAndSalt: {
    type: String,
    required: true,
    minlength: 3
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
