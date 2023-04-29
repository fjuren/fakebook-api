import express from 'express';
import * as postsController from '../controllers/posts.controller';

const router = express.Router();

router.get('/', postsController.getPosts);

export default router;
