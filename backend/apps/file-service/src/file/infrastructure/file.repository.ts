import { Express } from "express";
import { promisify } from "util";
import { writeFile, readFile } from 'fs/promises';
import fs from "fs";
import * as TE from "fp-ts/lib/TaskEither"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function";
import {join} from 'path'

// const readFromFile = promisify(fs.readFile)
// const writeToFile = promisify(fs.writeFile)

export const getFileContents = (path: string) =>
  TE.tryCatch(() => readFile(path, 'utf-8'), E.toError)

export const writeContentsToFile = (path: string) => (contents: Buffer) =>
  TE.tryCatch(() => writeFile(path, contents), E.toError)

export const saveFileData = (path: string, fileName: string) => (file: Express.Multer.File) =>
  pipe(
    file.buffer,
    writeContentsToFile(join(path, fileName))
  )