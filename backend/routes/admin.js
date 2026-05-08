const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

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
    next(err);
  }
});

// Add a new product (Admin only)
router.post('/products', auth, adminAuth, async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// Update a product (Admin only)
router.put('/products/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Delete a product (Admin only)
router.delete('/products/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// Get all orders (Admin only)
router.get('/orders', auth, adminAuth, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('products.product');
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Update order status (Admin only)
router.put('/orders/:id/status', auth, adminAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
