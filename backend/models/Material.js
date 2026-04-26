const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  fileUrl:     { type: String, required: true },
  fileType:    { type: String },
  subject:     { type: String, default: '' },
  tags:        [{ type: String }],
  uploader:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  downloads:   { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);