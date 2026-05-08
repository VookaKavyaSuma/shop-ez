const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [] });
    }
    
    // Check if product is already in the cart
    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
    
    if (existingProductIndex >= 0) {
      cart.products[existingProductIndex].quantity += (quantity || 1);
    } else {
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }
    
    await cart.save();
    cart = await Cart.findById(cart._id).populate('products.product');
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Remove from cart
router.post('/remove', auth, async (req, res) => {
  const { productId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    
    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    
    cart = await Cart.findById(cart._id).populate('products.product');
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
