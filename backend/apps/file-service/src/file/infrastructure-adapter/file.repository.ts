import { createDirectories, writeContentsToFile } from '@lib/file/data-access'
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function";
import { join } from 'path'

export const saveFile = (path: string, fileName: string) => (file: Express.Multer.File) =>
  pipe(
    createDirectories(path),
    TE.chain(_ =>
      writeContentsToFile(join(path, fileName))(file.buffer)
    )
  )