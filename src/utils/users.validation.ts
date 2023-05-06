import { body, check } from 'express-validator';

export const userSignupValidation = [
  body('firstName', 'First name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastName', 'Last name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'Email is required')
    .trim()
    .isEmail()
    .withMessage('Must enter a valid email address')
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password must be 8 to 100 characters long')
    .trim()
    .isLength({ max: 100 })
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be 8 to 100 characters, with at least 1 upper case, number and special symbol (eg. !@#$%)'
    )
    .escape(),
  body('confirm-password', 'Passwords must match')
    .trim()
    .exists()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Both passwords must match');
      }
      return true;
    }),
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

export const userLoginValidation = [
  body('email', 'Email is required')
    .trim()
    .isEmail()
    .withMessage('Must enter a valid email address')
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password must be 8 to 100 characters long')
    .trim()
    .isLength({ max: 100 })
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be 8 to 100 characters, with at least 1 upper case, number and special symbol (eg. !@#$%)'
    )
    .escape(),
];
