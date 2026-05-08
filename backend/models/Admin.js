const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  bannerImage: {
    type: String, // URL to the banner image
    required: true,
    default: 'https://via.placeholder.com/1200x400'
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  }]
});

module.exports = mongoose.model('Admin', AdminSchema);
