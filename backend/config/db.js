const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/myfinance';
  
  try {
    console.log(`Attempting connection to MongoDB at: ${primaryUri}`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✓ Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.warn(`! Could not connect to primary MongoDB (${err.message}).`);
    console.log('Initiating fallback embedded in-memory MongoDB server for development...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      console.log(`Starting in-memory MongoDB at ${memoryUri}`);
      
      await mongoose.connect(memoryUri);
      console.log('✓ Successfully connected to in-memory MongoDB database.');
      console.log('NOTE: Data will be persisted in memory for this session. To persist across restarts, install local MongoDB or configure MONGODB_URI in backend/.env.');
    } catch (memErr) {
      console.error('Failed to initialize in-memory MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, closeDB };
