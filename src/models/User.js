const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  password: String,
  token: String,
  role: { type: String, default: 'viewer' }, // viewer, super, admin
});

mongoose.model('User', userSchema);
