const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Check if in-memory DB is explicitly requested
    if (process.env.USE_IN_MEMORY_DB === 'true') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        mongoUri = mongoMemoryServer.getUri();
        console.log(`[Database] Using in-memory MongoDB at: ${mongoUri}`);
      } catch (err) {
        console.warn('[Database] mongodb-memory-server not available, falling back to MONGODB_URI');
      }
    }

    if (!mongoUri) {
      mongoUri = 'mongodb://127.0.0.1:27017/hotelpro';
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB: ${error.message}`);
    console.error(`[Database Help] Please ensure MongoDB is running locally at mongodb://127.0.0.1:27017/hotelpro`);
    console.error(`[Database Help] Or configure a MongoDB Atlas connection string in server/.env via MONGODB_URI`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    // Return null so server can still serve friendly database status error if offline
    return null;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error(`[Database Disconnect Error] ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
