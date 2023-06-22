// Recall
// interface Error {
//   name: string;
//   message: string;
//   stack?: string;
// }
import { Request, Response, NextFunction } from 'express';

export class BaseError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(404, `${message}`);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(400, `${message}`);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(409, `${message}`);
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
