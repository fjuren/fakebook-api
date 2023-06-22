// Recall
// interface Error {
//   name: string;
//   message: string;
//   stack?: string;
// }
import { Request, Response, NextFunction } from 'express';

export class BaseError extends Error {
  success: boolean;
  name: string;
  statusCode: number;

  constructor(
    success: boolean,
    name: string,
    statusCode: number,
    message: string
  ) {
    super(message);
    this.success = success;
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(false, 'Not found', 404, `${message}`);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(false, 'Bad request', 400, `${message}`);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(false, 'Conflict', 409, `${message}`);
  }
}

export const handleErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Server error' });
  }
};
