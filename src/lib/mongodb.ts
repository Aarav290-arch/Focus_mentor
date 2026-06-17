import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const connectMongoDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    throw error;
  }
}; 

export const connectToDatabase = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    if (mongoose.connections[0].readyState) {
      return true;
    }

    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};