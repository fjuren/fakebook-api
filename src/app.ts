import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import * as passportConfig from './config/passport';

import * as error from './utils/handleErrors';

import usersRouter from './routes/users.route';
import postsRouter from './routes/posts.route';

require('dotenv').config();

const app = express();

passportConfig.jwtPassport(passport);

app.use(passport.initialize());

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // API security allows request from other origins

app.use('/uploads', express.static('uploads'));

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.use((req, res, next) => {
  res.json(new error.NotFoundError('Page'));
});

export default app;
