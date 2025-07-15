

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.Mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" DB connected");
  } catch (err) {
    console.error(" Error connecting to DB:", err.message);
  }
};

module.exports = connectDb;
