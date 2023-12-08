const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const Tag = require('../models/tag');

// ... other routes
// Create a new note with title, content, and tags
router.post('/', async (req, res) => {

    const { title, content, tags } = req.body;  

    // Transform the tags array of strings to array of ObjectId references
    const tagIds = await Promise.all(tags.map(async (tagName) => {
        // Find or create the tag
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
            tag = await Tag.create({ name: tagName });
        }
        return tag._id;
    }));

    const note = new Note({
        title,
        content,
        tags: tagIds,
    });

  try {
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Return all notes (if tag parameter is specified only return notes with that tag)
// Return all notes that contain a particular tag
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
      const notes = await Note.find(query)
        .populate('tags', 'name')  // This line populates the tag objects instead of just their IDs
        .exec();
  
      //console.log(notes);
  
      // Send the notes as the response
      res.json(notes);
    } catch (error) {
      // If an error occurs, send a 500 response with the error message
      res.status(500).send({ error: error.message });
    }
  });
  
  
  
  
  router.get('/:id', async (req, res) => {
    // Fetch and return a single note by its ID
    try {
        const note = await Note.findById(req.params.id)
            .populate('tags', 'name')  // This line populates the tag objects instead of just their IDs
            .exec();
        res.json(note);
    } catch (error) {
      // If an error occurs, send a 500 response with the error message
      res.status(500).send({ error: error.message });  
    }

  });


  // router.post('/', (req, res) => {
  //   // Create a new note
  //   // For now, just sending a stubbed response
  //   res.json(["New note created"]);
  // });
  
  // Update a note based on user edits. Make sure this has all functionality of the post
  router.put('/:id', async (req, res) => {
    try {
      //retrieve edited note content from request
      const { title, content, tags } = req.body;
      
      // Transform the tags array of strings to array of ObjectId references
      const tagIds = await Promise.all(tags.map(async (tagName) => {
        // Find or create the tag
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
            tag = await Tag.create({ name: tagName });
        }
        return tag._id;
      }));

      // update the note in the database
      const updatedNote = await Note.findByIdAndUpdate(req.params.id, 
        { title, content, tags: tagIds }, 
        { new: true }); // { new: true } returns the updated document
      res.json(updatedNote);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  router.put('/:id', (req, res) => {
    // Update an existing note
    // For now, just sending a stubbed response
    res.json([`We updated note with ID ${req.params.id}`]);
  });
  
  router.delete('/:noteId', async (req, res) => {
    // Delete a note
    // For now, just sending a stubbed response
    //res.json([`We deleted note with ID ${req.params.id}`]);
    try {
        const { noteId } = req.params;

        // Find the note
        const note = await Note.findById(noteId);

        if(!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        // Remove the tag from the note's tag list
        await Note.findByIdAndDelete(noteId);

        res.status(200).json({ message: "Note removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });
  
  router.put('/removetag', async (req, res) => {
    // This endpoint removes a tag from a note
    const { noteId, tagId } = req.body;
    try {
      const note = await Note.findById(noteId);
      if (note) {
        note.tags = note.tags.filter(tag => tag.toString() !== tagId);
        await note.save();
        res.status(200).send({ message: 'Tag removed successfully' });
      } else {
        res.status(404).send({ message: 'Note not found' });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }    

  });


  router.delete('/:noteId/tags/:tagId', async (req, res) => {
        try {
            const { noteId, tagId } = req.params;

            // Find the note
            const note = await Note.findById(noteId);

            if(!note) {
                return res.status(404).json({ error: "Note not found" });
            }

            // Remove the tag from the note's tag list
            note.tags = note.tags.filter(tag => tag.toString() !== tagId);

            // Save the note
            await note.save();

                  // Check if this tag is being used in any other notes
                    const isTagUsedElsewhere = await Note.findOne({ tags: tagId });
                    if (!isTagUsedElsewhere) {
                        // If the tag is not used anywhere else, remove it from the tags table
                        await Tag.findByIdAndDelete(tagId);
                    }

            res.status(200).json({ message: "Tag removed successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


  router.post('/:noteId/tags', (req, res) => {
    // This endpoint should add a new tag to a note with the specified noteId
    // You would extract the tag from the request body and then update the database

    // For now, just sending a stubbed response
    res.json({ message: "Tag added successfully" });
  });

// Add a new tag to a note
  router.post('/:noteId/tags/:tagId', async (req, res) => {
    try {
      const { noteId, tagId } = req.params;
      const note = await Note.findById(noteId);
      
      if (!note.tags.includes(tagId)) {
        note.tags.push(tagId);
        await note.save();
        res.status(200).send('Tag added to note');
      } else {
        res.status(200).send('Tag already associated with this note');
      }
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;
