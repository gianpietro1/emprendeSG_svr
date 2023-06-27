const mongoose = require('mongoose');

const panelItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  date: Date,
  ownerName: String,
  ownerEmail: String,
  ownerWhatsapp: String,
});

mongoose.model('PanelItem', panelItemSchema);
