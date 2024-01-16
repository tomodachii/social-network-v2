import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveFile } from '../../infrastructure-adapter/file.repository';
import path from 'path'
import * as O from 'fp-ts/lib/Option'
import { Option, none, some } from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either'
import { Either, left, right } from 'fp-ts/lib/Either'
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'

export const uploadRouter = Router();

const getServiceFromRequestBody = (req: Request): Option<string> => {
  const serviceOption = O.fromNullable<string>(req.body.service);
  return O.match(
    () => none,
    (service: string) => {
      if (typeof service === 'string' && service !== '') {
        return some(service);
      } else {
        return none;
      }
    }
  )(serviceOption);
};

const getUserIDFromRequestBody = (req: Request): Option<string> => {
  const userIDOption = O.fromNullable<string>(req.body.userID);
  return O.match(
    () => none,
    (userID: string) => {
      if (typeof userID === 'string' && userID !== '') {
        return some(userID);
      } else {
        return none;
      }
    }
  )(userIDOption);
};


const getNameFromRequestBody = (req: Request): Option<string> => {
  const fileNameOption = O.fromNullable<string>(req.body.name)
  return O.match(
    () => none,
    (fileName: string) => {
      if (typeof fileName === 'string' && fileName !== '') {
        return some(fileName);
      } else {
        return none;
      }
    }
  )(fileNameOption);
};

const getFileFromRequestBody = (req: Request): Option<Express.Multer.File> => {
  const fileOption = O.fromNullable<Express.Multer.File>(req.file)
  return O.match(
    () => none,
    (file: Express.Multer.File) => {
      if (file.buffer) {
        return some(file);
      } else {
        return none;
      }
    }
  )(fileOption);
}

uploadRouter.post('/', (req: Request, res: Response) => {
  const uploadSessionId = uuidv4()
  const serviceOption: Option<string> = getServiceFromRequestBody(req)
  const fileOption: Option<Express.Multer.File> = getFileFromRequestBody(req)
  const userIDOption: Option<string> = getUserIDFromRequestBody(req)
  const fileNameOption: Option<string> = getNameFromRequestBody(req)

  // validate request body step
  const requestValidationResult: Either<string, TaskEither<Error, void>> = pipe(
    serviceOption,
    O.match(
      () => left("something"),
      (service: string) => 
        pipe(
          userIDOption,
          O.match(
            () => left('Error: Missing userID'),
            (userID: string) =>
              pipe(
                fileNameOption,
                O.match(
                  () => left('Error: Missing file name'),
                  (fileName: string) =>
                    pipe(
                      fileOption,
                      O.match(
                        () => left('Error: File content is missing'),
                        (file) => right(
                          saveFile(
                            path.join(__dirname, 'data', userID, service),
                            fileName
                          )(file.buffer)
                        )
                      )
                    )
                )
              )
          )
        )
    )
  )

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
      )
    }
  )(requestValidationResult);
});