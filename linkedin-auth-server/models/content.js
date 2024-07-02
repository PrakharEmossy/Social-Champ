const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  platform: String,
  content: String,
  accessToken: String,
  image: String,
  video: String,
  document: String,
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
