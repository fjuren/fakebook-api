import express from 'express';
import { postController } from '../controllers/post.controller';

const router = express.Router();

router.get('/', postController);

router.get('/', (req, res) => {
  res.json({
    message: 'API connected',
  });
});

export default router;
