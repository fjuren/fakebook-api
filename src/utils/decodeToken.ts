require('dotenv').config();
import Jwt, { JwtPayload } from 'jsonwebtoken';

export const decodeToken = (token: any) => {
  // get user information from jwt token
  const secret = process.env.JWT_SECRET as string;

  if (!token) {
    throw new Error();
  }

  // decode token with secret, extract user id and find user from db
  const decodedToken = Jwt.verify(token, secret) as JwtPayload;

  return decodedToken;
};
