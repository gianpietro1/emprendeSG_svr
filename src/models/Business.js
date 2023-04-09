const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  logo: String,
  flyer: String,
  instagram: String,
  facebook: String,
  whatsapp: String,
  email: String,
  web: String,
  category: String,
});

mongoose.model('Artist', artistSchema);
