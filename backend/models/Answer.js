const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  body:       { type: String, required: true },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question:   { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  votes:      { type: Number, default: 0 },
  voters:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAccepted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);