import { Express } from "express";
import { promisify } from "util";
import fs from "fs";
import * as TE from "fp-ts/lib/TaskEither"
import * as E from "fp-ts/lib/Either"

const readFromFile = promisify(fs.readFile)
const writeToFile = promisify(fs.writeFile)

const getFileContents = (path: string) =>
  TE.tryCatch(() => readFromFile(path, 'utf-8'), E.toError)