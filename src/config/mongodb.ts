import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const getMongoConnection = (): string => {
  return process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI_PROD || ''
    : process.env.MONGO_URI_DEV || '';
};

const mongoConnection = getMongoConnection();

const mongoConnect = async () => {
  try {
    await mongoose.connect(mongoConnection);
    console.log('Mongo connected');
  } catch (error) {
    console.log('Mongo error: ' + error);
  }
};

export default mongoConnect;
