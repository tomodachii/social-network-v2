import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Repository } from '@lib/shared/ddd-v2';
export type SaveFileContent = (fileBuffer: Buffer) => TaskEither<Error, void>
export type SaveFile = (path: string, fileName: string) => SaveFileContent
export type SaveFileTo = (rootDir: string) => SaveFile
import { File } from '../file.entity';

export interface FileRepository extends Repository<File> {
  rootDir: string,
  saveFile: SaveFile
}
