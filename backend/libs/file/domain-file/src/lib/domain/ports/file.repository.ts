import * as FileEntity from '../file.entity'
import { File, FileExtension, FilePrefix } from '../file.entity'
import { TaskEither } from 'fp-ts/lib/TaskEither'
// import { Repository } from '@lib/shared/ddd-v2';
export type SaveFile = (path: string, url: string) => (fileBuffer: Buffer) => TaskEither<Error, void>

export interface FileRepository {
  saveFile: SaveFile
}
