const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Get banner and categories
router.get('/', async (req, res) => {
  try {
    let adminData = await Admin.findOne();
    if (!adminData) {
      // Create default if not exists
      adminData = new Admin({
        bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070',
        categories: [
          { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500' },
          { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500' },
          { name: 'Home', image: 'https://images.unsplash.com/photo-1556020685-e631950a41fc?auto=format&fit=crop&w=500' }
        ]
      });
      await adminData.save();
    }
    res.json(adminData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
