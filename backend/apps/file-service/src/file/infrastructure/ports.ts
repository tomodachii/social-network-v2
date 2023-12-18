import { Express } from "express";
import * as TE from "fp-ts/lib/TaskEither"
import { TaskEither } from "fp-ts/lib/TaskEither";

type UploadFile = (file: Express.Multer.File) => TaskEither<Error, void>;