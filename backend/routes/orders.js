const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Create Order (Checkout)
router.post('/', auth, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderProducts = cart.products.map(p => {
      const priceAtPurchase = p.product.price - (p.product.price * (p.product.discount / 100));
      totalAmount += priceAtPurchase * p.quantity;
      return {
        product: p.product._id,
        quantity: p.quantity,
        priceAtPurchase
      };
    });

    const newOrder = new Order({
      user: req.user.id,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    const order = await newOrder.save();
    
    // Clear the cart
    cart.products = [];
    await cart.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('products.product');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    // Make sure user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an order
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    // Make sure user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await Order.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Order removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
