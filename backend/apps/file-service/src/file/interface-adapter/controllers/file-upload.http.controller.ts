import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LocalRepository } from '../../infrastructure-adapter/file.repository';
import path from 'path'
import * as E from 'fp-ts/lib/Either'
import { Either, left, right, getApplicativeValidation } from 'fp-ts/lib/Either'
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
import { UploadFileCommandHandler } from '@lib/file/feature'
import { ServicePrefix, SaveFileContent } from '@lib/file/domain';
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { sequenceT } from 'fp-ts/lib/Apply'

export const uploadRouter = Router();

const isNotBlankStringField = (field: string) => (s: string): Either<string, string> =>
  typeof s === 'string' && s !== '' ? right(s) : left(`Error: Missing ${field}`)

const isNotNoneFileField = (field: string) => (file: Express.Multer.File): Either<string, Express.Multer.File> =>
  file.buffer ? right(file) : left(`Error: Missing ${field} content`)

const getServiceFromRequestBody = (req: Request): Either<string, string> => {
  const serviceFromNullable = E.fromNullable<string>('Error: Missing userID');
  const serviceEither = serviceFromNullable<string>(req.body.service);
  return pipe(
    serviceEither,
    E.chain(isNotBlankStringField('service'))
  )
};

const getUserIDFromRequestBody = (req: Request): Either<string, string> => {
  const userIDFromNullable = E.fromNullable<string>('Error: Missing userID');
  const userIDEither = userIDFromNullable<string>(req.body.userID);
  return pipe(
    userIDEither,
    E.chain(isNotBlankStringField('userID'))
  )
};


const getNameFromRequestBody = (req: Request): Either<string, string> => {
  const nameFromNullable = E.fromNullable<string>('Error: Missing name');
  const fileNameEither = nameFromNullable<string>(req.body.name);
  return pipe(
    fileNameEither,
    E.chain(isNotBlankStringField('name'))
  )
};

const getFileFromRequestBody = (req: Request): Either<string, Express.Multer.File> => {
  const fileFromNullable = E.fromNullable<string>('Error: Missing File');
  const fileEither = fileFromNullable<Express.Multer.File>(req.file)
  return pipe(
    fileEither,
    E.chain(isNotNoneFileField('file'))
  )
}

function liftE<L, A, B>(
  check: (a: A) => Either<L, B>
): (a: A) => Either<NonEmptyArray<L>, B> {
  return a =>
    pipe(
      check(a),
      E.mapLeft(a => [a])
    )
}

uploadRouter.post('/', (req: Request, res: Response) => {
  const uploadSessionId = uuidv4()
  const repository = new LocalRepository(path.join(__dirname, 'data'))
  const uploadFileCommandHandler = new UploadFileCommandHandler(repository)
  const serviceEither: Either<string, string> = getServiceFromRequestBody(req)
  const fileEither: Either<string, Express.Multer.File> = getFileFromRequestBody(req)
  const userIDEither: Either<string, string> = getUserIDFromRequestBody(req)
  const fileNameEither: Either<string, string> = getNameFromRequestBody(req)

  // These commented lines are kept for refactoring purpose

  // const serviceEither: Either<NonEmptyArray<string>, string> = liftE(getServiceFromRequestBody)(req)
  // const fileEither: Either<NonEmptyArray<string>, Express.Multer.File> = liftE(getFileFromRequestBody)(req)
  // const userIDEither: Either<NonEmptyArray<string>, string> = liftE(getUserIDFromRequestBody)(req)
  // const fileNameEither: Either<NonEmptyArray<string>, string> = liftE(getNameFromRequestBody)(req)

  // const requestValidationResult = pipe(
  //   sequenceT(getApplicativeValidation(getSemigroup<string>()))(
  //     serviceEither,
  //     userIDEither,
  //     fileNameEither,
  //     fileEither
  //   ),
  //   E.map(([service, userID, fileName, file]) => {
  //     const saveFileEither: E.Either<string, (fileBuffer: Buffer) => TaskEither<Error, void>> = uploadFileCommandHandler.makeExecutor(
  //       service as ServicePrefix,
  //       userID,
  //       fileName,
  //       file.mimetype,
  //       file.size
  //     )
  //     return E.match(
  //       (error: string) => left([error]),
  //       (uploadFileCommandHandlerExecute: SaveFileContent) => right(uploadFileCommandHandlerExecute(file.buffer))
  //     )(saveFileEither)
  //   }),
  // )

  const requestValidationResult = pipe(
    E.Do,
    E.bind('service', () => serviceEither),
    E.bind('file', () => fileEither),
    E.bind('userID', () => userIDEither),
    E.bind('fileName', () => fileNameEither),
    E.map(({service, userID, fileName, file}) => ({service, userID, fileName, file})),
  )

  const domainValidationResult = E.match(
    (error: string) => left(error),
    ({service, userID, fileName, file}) => {
      const saveFileEither: E.Either<string, (fileBuffer: Buffer) => TaskEither<Error, void>> = uploadFileCommandHandler.makeExecutor(
        service as ServicePrefix,
        userID,
        fileName,
        file.mimetype,
        file.size
      )
      return E.match(
        (error: string) => left(error),
        (uploadFileCommandHandlerExecute: SaveFileContent) => right(uploadFileCommandHandlerExecute(file.buffer))
      )(saveFileEither)
    }
  )(requestValidationResult)

  E.match(
    (error: string) => {
      res.status(400).send(error)
    },
    (taskEither: TaskEither<Error, void>) => {
      return taskEither().then(
        E.fold(
          (error) => res.status(400).send(error),
          () => res.status(200).json({ uploadSessionId: uploadSessionId })
        )
      )
    }
  )(domainValidationResult);

});