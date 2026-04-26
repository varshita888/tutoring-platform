const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  body:     { type: String, required: true },
  tags:     [{ type: String, lowercase: true }],
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views:    { type: Number, default: 0 },
  votes:    { type: Number, default: 0 },
  voters:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isSolved: { type: Boolean, default: false },
  acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);