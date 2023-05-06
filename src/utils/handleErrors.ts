// Recall
// interface Error {
//   name: string;
//   message: string;
//   stack?: string;
// }

export class BaseError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class NotFound extends BaseError {
  name: string;

  constructor(name: string) {
    super(404, `Oops, ${name} not found.`);

    this.name = name;
  }
}

export class BadRequest extends BaseError {
  name: string;

  constructor(name: string) {
    super(400, `Oops, the client has made an error. ${name}`);

    this.name = name;
  }
}
