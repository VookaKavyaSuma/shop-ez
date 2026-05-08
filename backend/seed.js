const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Experience pure audio with our premium noise-cancelling headphones. Features 30-hour battery life and ultra-comfortable ear cushions.",
    price: 299.99,
    discount: 15,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500"]
  },
  {
    name: "Minimalist Leather Watch",
    description: "Elegant and timeless, this leather watch complements any outfit. Water-resistant and built with precision quartz movement.",
    price: 120.00,
    discount: 0,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500"]
  },
  {
    name: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with rich sound and built-in virtual assistant. Control your smart home with ease.",
    price: 99.99,
    discount: 10,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=500"]
  },
  {
    name: "Classic Aviator Sunglasses",
    description: "Protect your eyes in style with these classic aviators. 100% UV protection and polarized lenses.",
    price: 85.00,
    discount: 20,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500"]
  }
];

const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  console.log("Database Seeded!");
  process.exit();
};

seedDB();
