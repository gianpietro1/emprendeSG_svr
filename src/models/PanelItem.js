const mongoose = require('mongoose');

const panelItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  date: Date,
});

mongoose.model('PanelItem', panelItemSchema);
