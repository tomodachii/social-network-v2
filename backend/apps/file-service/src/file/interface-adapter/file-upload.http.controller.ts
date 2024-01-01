import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveFile } from '../infrastructure-adapter/file.repository';
import path from 'path'
import * as E from 'fp-ts/lib/Either'
import { setFileStatus } from '../infrastructure-adapter/file.status.adapter';


export const uploadRouter = Router();

uploadRouter.post('/', (req: Request, res: Response) => {
  const fileId = uuidv4();
  const fileName = `${fileId}.txt`;

  const file: Express.Multer.File = req.file

  saveFile(
    path.join(__dirname, '..', 'data'),
    fileName)(file)()
    .then(
      either => E.fold(
        () => res.status(500).send("Error uploading file"),
        () => res.status(200).json({ fileId })
      )(either)
    )
  // Store file status as UPLOADING initially
  setFileStatus(fileId, 'UPLOADING');
});