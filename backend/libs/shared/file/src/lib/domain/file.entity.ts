import { FILE_EXTENSION, FILE_TYPE } from "./file.type";
import { Opaque } from '@lib/shared/common/types';
import { match } from 'ts-pattern'

export type ServicePrefix = Opaque<string, 'ServicePrefix'>

export type FileType = FILE_TYPE.IMAGE | FILE_TYPE.VIDEO | FILE_TYPE.DOCUMENT

export type ImageFilePrefix = {
  service: ServicePrefix,
  owner: String
  type: FILE_TYPE.IMAGE,
}

export type VideoFilePrefix = {
  service: ServicePrefix,
  owner: String
  type: FILE_TYPE.VIDEO,
}

export type DocumentFilePrefix = {
  service: ServicePrefix,
  owner: String
  type: FILE_TYPE.DOCUMENT,
}

export type FilePrefix = ImageFilePrefix | VideoFilePrefix | DocumentFilePrefix

export type ImageExtension = FILE_EXTENSION.JPG | FILE_EXTENSION.PNG;
export type VideoExtension = FILE_EXTENSION.MP4;
export type DocumentExtension = FILE_EXTENSION.TXT | FILE_EXTENSION.PDF;

export type FileExtension = ImageExtension | VideoExtension | DocumentExtension

export type ImageFile = {
  ext: ImageExtension,
  name: String
}

export type VideoFile = {
  ext: VideoExtension,
  name: String
}

export type DocumentFile = {
  ext: DocumentExtension,
  name: String
}

export type File = ImageFile | VideoFile | DocumentFile

export type FilePath =
  | { prefix: ImageFilePrefix, file: ImageFile }
  | { prefix: VideoFilePrefix, file: VideoFile }
  | { prefix: DocumentFilePrefix, file: DocumentFile };

export const getFilePrefixString = (filePrefix: FilePrefix): string => {
  return `${filePrefix.service}/${filePrefix.owner}/${filePrefix.type}`
}

export const getFileString = (file: File): string => {
  return `${file.name}.${file.ext}`
}

export const getFilePathString = (filePath: FilePath): string => {
  return `${getFilePrefixString(filePath.prefix)}/${getFileString(filePath.file)}`
}

const createImageFilePrefix = (service: ServicePrefix, owner: String): ImageFilePrefix => ({ service, owner, type: FILE_TYPE.IMAGE })
const createVideoFilePrefix = (service: ServicePrefix, owner: String): VideoFilePrefix => ({ service, owner, type: FILE_TYPE.VIDEO })
const createDocumentFilePrefix = (service: ServicePrefix, owner: String): DocumentFilePrefix => ({ service, owner, type: FILE_TYPE.DOCUMENT })

export const createFilePrefix = (service: ServicePrefix, owner: String, type: FileType): FilePrefix => {
  return match(type)
    .with(FILE_TYPE.IMAGE, (_) => createImageFilePrefix(service, owner))
    .with(FILE_TYPE.VIDEO, (_) => createVideoFilePrefix(service, owner))
    .with(FILE_TYPE.DOCUMENT, (_) => createDocumentFilePrefix(service, owner))
    .exhaustive()
}