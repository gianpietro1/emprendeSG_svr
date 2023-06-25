const mongoose = require('mongoose');

const panelItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
});

mongoose.model('PanelItem', panelItemSchema);
