import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';

const db = process.env.MONGO_URI_DEV as string;

describe('Posts testing', () => {
  beforeEach(async () => {
    await mongoose.connect(db);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/posts/', () => {
    describe('Given posts exist', () => {
      it('Should return all the posts requested but follows the query', async () => {
        const res = await request(app)
          .get('/api/posts/')
          .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
      });
    });
  });
});
