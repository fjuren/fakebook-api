import app from './app';
import connectDB from './config/mongodb';

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
