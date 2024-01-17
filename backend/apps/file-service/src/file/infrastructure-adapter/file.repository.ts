import { createDirectories, writeContentsToFile } from '@lib/file/data-access'
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function";
import { FileRepository, SaveFileContent } from '@lib/file/domain'
import path from 'path'

export class LocalRepository implements FileRepository {

  constructor(public rootDir: string) {
    this.rootDir = rootDir
  }

  saveFile(filePath: string, fileName: string): SaveFileContent {
    return (buffer) =>
      pipe(
        createDirectories(path.join(this.rootDir, filePath)),
        TE.chain(() =>
          writeContentsToFile(path.join(this.rootDir, filePath, fileName))(buffer)
        )
      )
  }
}