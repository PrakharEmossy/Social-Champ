const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  platform: String,
  content: String,
  accessToken: String,
},{timestamps:true});

module.exports = mongoose.model('Content', contentSchema);
