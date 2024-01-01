import { writeFile, readFile, mkdir } from 'fs/promises';
import * as TE from "fp-ts/lib/TaskEither"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function";
import { join } from 'path'

export const getFileContents = (path: string) =>
  TE.tryCatch(() => readFile(path, 'utf-8'), E.toError)

export const writeContentsToFile = (path: string) => (contents: Buffer) =>
  TE.tryCatch(() => writeFile(path, contents), E.toError)

export const createDirectories = (path: string) =>
  TE.tryCatch(() => mkdir(path, { recursive: true }), E.toError)

export const saveFile = (path: string, fileName: string) => (file: Express.Multer.File) =>
  pipe(
    createDirectories(path),
    TE.chain(_ =>
      writeContentsToFile(join(path, fileName))(file.buffer)
    )
  )