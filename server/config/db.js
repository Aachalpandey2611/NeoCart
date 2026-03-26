const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : "";

    // Guard against accidentally prefixed env values such as "MONGO_URI=mongodb+srv://..."
    if (mongoUri.startsWith("MONGO_URI=")) {
      mongoUri = mongoUri.slice("MONGO_URI=".length);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
