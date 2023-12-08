
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
//const Note = require('../models/note');
const Tag = require('../models/tag');

// ... other routes

router.get('/', async (req, res) => {
    // This endpoint should query your database to get a list of all unique tags currently in use
    // Once the query is complete, you would send the list of tags as a response
    try {
        const tags = await Tag.find().select('name');
        res.json(tags);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
});

router.get('/names2ids', async (req, res) => {
    //this endpoint expects a list, tagArray, of tag names as query 
    //it returns a list of tagIds
    try {
        const tagNames = req.query.tagArray.split(','); // Assuming tagArray is a comma-separated list of tag names
        const tags = await Tag.find({ name: { $in: tagNames } }); // Finds tags with names in the tagNames array

        const tagIds = tags.map(tag => tag._id); // Creates an array of tag IDs
        res.json(tagIds);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const ObjectId = mongoose.Types.ObjectId;

router.get('/ids2names', async (req, res) => {
    try {
        const tagIds = req.query.tagIds.split(',').map(id => new ObjectId(id)); // Convert string IDs to ObjectId types
        const tags = await Tag.find({ _id: { $in: tagIds } });

        const tagNames = tags.map(tag => tag.name); // Creates an array of tag names
        res.json(tagNames);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;