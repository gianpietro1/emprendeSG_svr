const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  shortName: String,
});

mongoose.model('Category', categorySchema);
