const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

//const Note = require('./models/note');
//const Tag = require('./models/tag');

const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

// Requiring your routes
const notesRoutes = require('./routes/notes');
const tagsRoutes = require('./routes/tags');
const decksRoutes = require('./routes/decks');

// Using your routes
app.use('/notes', notesRoutes);
app.use('/tags', tagsRoutes);
app.use('/decks', decksRoutes);

//

mongoose.connect('mongodb+srv://dan:OG5ibRvGXAMRFM5q@cluster0.ifwoswo.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// const noteSchema = new mongoose.Schema({
//   title: String,
//   text: String,
//   tags: [String],
//   // any other properties you need if any
// });

  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





