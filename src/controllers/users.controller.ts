import { Request, Response, NextFunction } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import * as usersServices from '../services/users.services';
import * as handleErrors from '../utils/handleErrors';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(
        res.status(400).json({
          success: false,
          errors: errors.array(),
        })
      );
      return handleErrors.BadRequest; // 400
    }

    const { firstName, lastName, email, password, avatar } = req.body;

    const newUser = await usersServices.signup(
      firstName,
      lastName,
      email,
      password,
      avatar
    );

    res.status(200);
    // res.json(newUser); // careful. newUser contains hashed password
    res.send({ success: true, message: 'Account created successfully' });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
};
