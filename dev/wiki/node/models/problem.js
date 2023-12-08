const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  problemType: {
    type: String,
    required: true,
    enum: ['multiple choice', 'essay', 'number'],
  },
  problemText: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  hint: {
    type: String,
    default: '',
  },
  modelAnswer: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    default: '',
  },
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
