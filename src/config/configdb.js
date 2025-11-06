import mongoose from 'mongoose';
import dotenv from 'dotenv';

import fs from "fs";
const config = JSON.parse(fs.readFileSync("./src/config/config.json", "utf8"));


dotenv.config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB connected successfully to ${dbConfig.uri}`);
  } catch (error) {
    console.error(' Unable to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;