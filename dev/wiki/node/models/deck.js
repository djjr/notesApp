const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  title: String,
  URL: String,
  platform: String,
  year: Number,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
});

const Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;
