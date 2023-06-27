const mongoose = require('mongoose');

const panelItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  date: Date,
  owner: String,
  whatsapp: String,
});

mongoose.model('PanelItem', panelItemSchema);
