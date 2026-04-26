const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true },
  bio:        { type: String, default: '' },
  reputation: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.methods.matchPassword = function (enteredPassword) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);