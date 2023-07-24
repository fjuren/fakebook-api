import { Request, Response } from 'express-serve-static-core';

export const config = async (req: Request, res: Response) => {
  const fb_ClientID = process.env.FACEBOOK_CLIENTID;
  const fb_secret = process.env.FACEBOOK_SECRET;

  res.json({ fb_ClientID, fb_secret });
};
