const express = require('express');
const router = express.Router();
const Deck = require('../models/deck');
const Tag = require('../models/tag');
//const { model } = require('mongoose');

// ... other routes
// Create a new note with title, content, and tags
router.post('/', async (req, res) => {

    const { title, URL, platform, year, tags } = req.body;  

    // Transform the tags array of strings to array of ObjectId references
    const tagIds = await Promise.all(tags.map(async (tagName) => {
        // Find or create the tag
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
            tag = await Tag.create({ name: tagName });
        }
        return tag._id;
    }));

    const deck = new Deck({
        title,
        URL,
        platform,
        year,
        tags: tagIds,
    });

  try {
    await deck.save();
    res.status(201).json(deck);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Return all notes (if tag parameter is specified only return notes with that tag)
// Return all decks that contain a particular tag
router.get('/', async (req, res) => {
    console.log(req.query.tagIds);
    try {
      const tagIds = req.query.tagIds; // Getting tagIds from query parameter
  console.log(`in get route tagIds: ${tagIds}`)
      let query = {};
  
      // If tagIds are provided, find notes with all those tags, otherwise find all notes
      if (tagIds) {
        const tagIdArray = tagIds.split(','); // Split the comma-separated string into an array
        query = { tags: { $all: tagIdArray } }; // Using $all query operator to match all tags
      }
      console.log("QUERY", query);
      // Query the database to get all matching notes
      const decks = await Deck.find(query)
        .populate('tags', 'name')  // This line populates the tag objects instead of just their IDs
        .exec();
  
      //console.log(notes);
  
      // Send the notes as the response
      res.json(decks);
    } catch (error) {
      // If an error occurs, send a 500 response with the error message
      res.status(500).send({ error: error.message });
    }
  });

  module.exports = router;