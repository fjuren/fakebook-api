import { body, check } from 'express-validator';

export const newPostValidation = [
  body('content', 'Post must be at least 5 characters long.')
    .trim()
    .isLength({ min: 5 })
    .escape(),

  // TODO
  // [ ] Need to figure out how I will import/save images; currently just a url string
  //   check('image')
  //     .optional()
  //     .custom(async (value) => {
  //       const fileTypes = ['png', 'jpg', 'jpeg'];
  //       const fileExtension = value.file.mimetype.split('/').pop();
  //       if (!fileTypes.includes(fileExtension)) {
  //         throw new Error('Image format must be either png, jpg, or jpeg');
  //       }
  //     }),
];
