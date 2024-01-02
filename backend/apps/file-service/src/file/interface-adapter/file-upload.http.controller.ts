import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveFile } from '../infrastructure-adapter/file.repository';
import path from 'path'
import * as O from 'fp-ts/lib/Option'
import { Option, none, some } from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either'
import { Either, left, right } from 'fp-ts/lib/Either'
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
// import { setFileStatus } from '../infrastructure-adapter/file.status.adapter';

export const uploadRouter = Router();

const getPathFromRequestBody = (req: Request): Option<string> => {
  const filePathOption = O.fromNullable<string>(req.body.path);
  return O.match(
    () => none,
    (filePath) => {
      if (typeof filePath === 'string' && filePath !== '') {
        return some(filePath);
      } else {
        return none;
      }
    }
  )(filePathOption);
};


const getNameFromRequestBody = (req: Request): Option<string> => {
  const fileNameOption = O.fromNullable<string>(req.body.name);
  return O.match(
    () => none,
    (fileName) => {
      if (typeof fileName === 'string' && fileName !== '') {
        return some(fileName);
      } else {
        return none;
      }
    }
  )(fileNameOption);
};

uploadRouter.post('/', (req: Request, res: Response) => {
  const uploadSessionId = uuidv4()
  const file: Express.Multer.File = req.file
  const filePathOption: Option<string> = getPathFromRequestBody(req)
  const fileNameOption: Option<string> = getNameFromRequestBody(req)

  const resultEither: Either<string, TaskEither<Error, void>> = pipe(
    filePathOption,
    O.match(
      () => {
        return left('Error: Missing file path');
      },
      (filePath: string) =>
        pipe(
          fileNameOption,
          O.match(
            () => {
              return left('Error: Missing file name');
            },
            (fileName: string) =>
              right(
                saveFile(
                  path.join(__dirname, '..', 'data', filePath),
                  fileName
                )(file)
              )
          )
        )
    )
  );

  E.match(
    (error: string) => {
      res.status(400).send(error)
    },
    (taskEither: TaskEither<Error, void>) => {
      return taskEither().then(
        E.fold(
          () => res.status(400).send("Error uploading file"),
          () => res.status(200).json({ uploadSessionId: uploadSessionId })
        )
      );
    }
  )(resultEither);
});