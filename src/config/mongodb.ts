import mongoose from 'mongoose';
const mongoConnection = process.env.MONGO_URI as string;

const mongoConnect = async () => {
  try {
    await mongoose.connect(mongoConnection);
  } catch (error) {
    console.log('Mongo error: ' + error);
  }
};

export default mongoConnect;
