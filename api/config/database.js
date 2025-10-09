const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // collection list
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(collections);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
