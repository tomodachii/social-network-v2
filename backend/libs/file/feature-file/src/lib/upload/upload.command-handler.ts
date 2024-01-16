import {
  FileRepository,
  File,
  FileExtension,
  FilePrefix,
  ServicePrefix,
  SaveFile,
  createFile,
  getFileURL,
  getFilePath,
  getFileNameStringPath
} from '@lib/file/domain'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { Either, left, right } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

export class UploadFileCommandHandler {
  protected readonly repo: FileRepository

  constructor(
    repo: FileRepository
  ) {
    this.repo = repo
  }

  execute(
    service: ServicePrefix,
    userID: string,
    name: string,
    mimetype: string,
    size: number
  ): Either<string, (fileBuffer: Buffer) => TaskEither<Error, void>> {
    return pipe(
      E.Do,
      E.bind('file', () => createFile(service as ServicePrefix, userID, name, mimetype, size)),
      E.bind('url', ({ file }) => getFileURL(file)),
      E.bind('filePath', ({ file }) => getFilePath(file)),
      E.map(({ url, filePath }) => this.repo.saveFile(filePath, url))
    )
  }
}