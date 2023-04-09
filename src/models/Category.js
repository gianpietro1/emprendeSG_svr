const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  label: { type: String, unique: true },
  value: String,
});

mongoose.model('Category', categorySchema);
