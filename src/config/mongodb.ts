import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const mongoConnection = process.env.MONGO_URI_DEV as string;

const mongoConnect = async () => {
  try {
    await mongoose
      .connect(mongoConnection)
      .then(() => console.log('Mongo connected'))
      .catch((e) => console.log(e));
  } catch (error) {
    console.log('Mongo error: ' + error);
  }
};

export default mongoConnect;
