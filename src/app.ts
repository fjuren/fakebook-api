import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import postRouter from './routes/post.route';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the timeline',
  });
});

app.use('/api/posts', postRouter);

export default app;
