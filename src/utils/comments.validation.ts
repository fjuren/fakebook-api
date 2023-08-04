import { body } from 'express-validator';

export const newCommentValidation = [
  body('content', 'Post must be at least 1 characters long.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
];
