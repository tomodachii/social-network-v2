import { Router, Request, Response } from 'express';

export const uploadRouter = Router();

uploadRouter.post('/', (req: Request, res: Response) => {
  res.send('File uploaded');
});