import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as error from './utils/handleErrors';

import usersRouter from './routes/users.route';
import postsRouter from './routes/posts.route';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.use((req, res, next) => {
  res.json(new error.NotFound('Page'));
});

export default app;
