const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
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
  voteCount: { type: Number, default: 0 },
  voteSum: { type: Number, default: 0 },
  voteAvg: { type: Number, default: 0 },
});

mongoose.model('Business', businessSchema);
