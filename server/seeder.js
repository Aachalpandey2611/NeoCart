require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const products = [
  {
    name: 'Quantum VR Headset X1',
    description: 'The most immersive VR experience with 16K dual displays, haptic sensory feedback, and zero-latency wireless connection.',
    price: 899.99,
    originalPrice: 1299.00,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
    category: 'Gaming',
    brand: 'NeoVision',
    stock: 25,
    featured: true,
    badge: 'HOT',
    rating: 4.8,
    numReviews: 142
  },
  {
    name: 'NeoWatch Pro 3',
    description: 'A futuristic wearable that monitors 24/7 biometrics, projects a holographic UI, and syncs perfectly with your smart home.',
    price: 349.99,
    originalPrice: 420.00,
    image: 'https://images.unsplash.com/photo-1544117518-30df578096a4?w=800&q=80',
    category: 'Wearables',
    brand: 'WristTech',
    stock: 50,
    featured: true,
    badge: 'NEW',
    rating: 4.9,
    numReviews: 89
  },
  {
    name: 'CyberAudio Pulse Buds',
    description: 'Bone-conduction studio-quality audio with advanced ANC and 48 hours of battery life in a glass charging case.',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    category: 'Audio',
    brand: 'AcousticX',
    stock: 120,
    featured: false,
    badge: 'SALE',
    rating: 4.5,
    numReviews: 45
  },
  {
    name: 'PixelKeyboard Pro Mechanical',
    description: 'Custom mechanical keyboard with OLED screen, infinite RGB zones, and hotswappable optical switches.',
    price: 159.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
    category: 'Accessories',
    brand: 'LogiType',
    stock: 80,
    featured: true,
    badge: 'NEW',
    rating: 5.0,
    numReviews: 322
  },
  {
    name: 'HoloDesk Smart Lamp',
    description: 'Voice-controlled smart lamp that projects your notifications onto your desk with adaptable lighting temperatures.',
    price: 129.00,
    originalPrice: 199.00,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&q=80',
    category: 'Smart Home',
    brand: 'Lumina',
    stock: 45,
    featured: false,
    badge: 'NEW',
    rating: 4.7,
    numReviews: 67
  },
  {
    name: 'HyperX G-Pad Elite',
    description: 'Ultra-fast haptic controller with zero-drift Hall Effect sticks and a built-in touchscreen for macros.',
    price: 79.99,
    originalPrice: 99.00,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35802d3e?w=800&q=80',
    category: 'Gaming',
    brand: 'ControllerMaster',
    stock: 200,
    featured: true,
    badge: 'HOT',
    rating: 4.6,
    numReviews: 1210
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    console.log('Old products removed...');
    
    await Product.insertMany(products);
    console.log('New futuristic products added successfully!');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
