import { createDirectories, writeContentsToFile } from '@lib/file/data-access'
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function";
import { join } from 'path'
import { SaveFile } from '@lib/file/domain'

export const saveFile: SaveFile = (path, url) => (buffer) =>
  pipe(
    createDirectories(path),
    TE.chain(_ =>
      writeContentsToFile(url)(buffer)
    )
  )