require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'NeoVision Pro X1',
    description: 'Next-gen AR glasses with holographic display, 8K resolution, and AI-powered vision assistance. Experience the future of augmented reality.',
    price: 1299.99,
    originalPrice: 1599.99,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=600&fit=crop',
    category: 'Electronics',
    brand: 'NeoVision',
    stock: 25,
    rating: 4.8,
    numReviews: 124,
    featured: true,
    badge: 'HOT',
  },
  {
    name: 'QuantumBeat Pro',
    description: 'Wireless earbuds with quantum noise cancellation, 48h battery, spatial audio and AI-adaptive sound. Pure audiophile bliss.',
    price: 399.99,
    originalPrice: 499.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
    category: 'Audio',
    brand: 'QuantumBeat',
    stock: 80,
    rating: 4.9,
    numReviews: 312,
    featured: true,
    badge: 'NEW',
  },
  {
    name: 'NexWatch Ultra',
    description: 'Titanium smartwatch with AMOLED display, bio-sensor array, 14-day battery, and satellite GPS. The ultimate wearable.',
    price: 799.99,
    originalPrice: 999.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    category: 'Wearables',
    brand: 'NexWatch',
    stock: 40,
    rating: 4.7,
    numReviews: 89,
    featured: true,
    badge: 'SALE',
  },
  {
    name: 'HoloDesk X Pro',
    description: 'Revolutionary holographic display desk with 4K projection, touch-sensitive surface, and integrated AI assistant.',
    price: 2499.99,
    originalPrice: 2999.99,
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=600&h=600&fit=crop',
    category: 'Electronics',
    brand: 'HoloDesk',
    stock: 10,
    rating: 4.6,
    numReviews: 45,
    featured: true,
    badge: 'NEW',
  },
  {
    name: 'CyberPad Gaming Pro',
    description: 'Ultra-thin gaming tablet with 165Hz display, Snapdragon Elite, vapor cooling, and 12,000mAh battery.',
    price: 1199.99,
    originalPrice: 1399.99,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop',
    category: 'Gaming',
    brand: 'CyberPad',
    stock: 35,
    rating: 4.8,
    numReviews: 201,
    featured: true,
    badge: 'HOT',
  },
  {
    name: 'AuraRing Bio',
    description: 'Smart ring with health monitoring, sleep tracking, contactless payments, and 7-day battery. Luxury meets technology.',
    price: 349.99,
    originalPrice: 429.99,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop',
    category: 'Wearables',
    brand: 'AuraRing',
    stock: 60,
    rating: 4.5,
    numReviews: 156,
    featured: false,
    badge: 'NEW',
  },
  {
    name: 'NeoSound Spatial',
    description: 'Premium wireless headphones with spatial audio, adaptive EQ, 60h battery, and premium leather cushions.',
    price: 549.99,
    originalPrice: 699.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    category: 'Audio',
    brand: 'NeoSound',
    stock: 55,
    rating: 4.9,
    numReviews: 278,
    featured: false,
    badge: 'SALE',
  },
  {
    name: 'NeuroGame Controller V2',
    description: 'Haptic feedback controller with bio-sensing grip, pressure-sensitive buttons, and 120fps ultra-low latency.',
    price: 189.99,
    originalPrice: 229.99,
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&h=600&fit=crop',
    category: 'Gaming',
    brand: 'NeuroGame',
    stock: 100,
    rating: 4.7,
    numReviews: 432,
    featured: true,
    badge: '',
  },
  {
    name: 'ZeroGravity Speaker',
    description: 'Levitating Bluetooth speaker with 360° surround sound, 20W RMS, RGB ambient lighting ring, and 15h battery.',
    price: 299.99,
    originalPrice: 379.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    category: 'Audio',
    brand: 'ZeroGravity',
    stock: 45,
    rating: 4.6,
    numReviews: 167,
    featured: false,
    badge: 'NEW',
  },
  {
    name: 'SmartNest Hub X',
    description: 'AI-powered home hub controlling 200+ devices, with built-in camera, voice assistant, and energy monitoring.',
    price: 279.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    category: 'Smart Home',
    brand: 'SmartNest',
    stock: 70,
    rating: 4.4,
    numReviews: 203,
    featured: false,
    badge: '',
  },
  {
    name: 'PixelKeyboard Pro',
    description: 'Mechanical gaming keyboard with per-key RGB, optical switches, OLED status display, and custom macros engine.',
    price: 229.99,
    originalPrice: 279.99,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&h=600&fit=crop',
    category: 'Accessories',
    brand: 'PixelKeyboard',
    stock: 90,
    rating: 4.8,
    numReviews: 389,
    featured: false,
    badge: 'HOT',
  },
  {
    name: 'NanoMouse X1',
    description: 'Ultra-light gaming mouse at 45g, with 36,000 DPI optical sensor, wireless, and 80h battery life.',
    price: 149.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
    category: 'Accessories',
    brand: 'NanoMouse',
    stock: 120,
    rating: 4.9,
    numReviews: 521,
    featured: false,
    badge: 'SALE',
  },
];

const seedDB = async () => {
  await connectDB();
  try {
    await Product.deleteMany({});
    console.log('🗑️  Products cleared');
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully`);

    // Create admin user
    await User.deleteMany({ email: 'admin@neocart.com' });
    await User.create({
      name: 'NeoCart Admin',
      email: 'admin@neocart.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@neocart.com / admin123456');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
