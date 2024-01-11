import { 
  IMAGE_FILE_EXTENSION, 
  VIDEO_FILE_EXTENSION, 
  DOCUMENT_FILE_EXTENSION, 
  FILE_TYPE, 
  FILE_TYPE_PREFIX,
} from "./file.type";
import { Opaque } from '@lib/shared/common/types'
import { match } from 'ts-pattern'
import { Either, left, right } from 'fp-ts/lib/Either'
import * as E from 'fp-ts/lib/Either'

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

export type ImageExtension = IMAGE_FILE_EXTENSION.JPG | IMAGE_FILE_EXTENSION.PNG;
export type VideoExtension = VIDEO_FILE_EXTENSION.MP4;
export type DocumentExtension = DOCUMENT_FILE_EXTENSION.TXT | DOCUMENT_FILE_EXTENSION.PDF;

export type FileExtension = ImageExtension | VideoExtension | DocumentExtension

export type ImageFile = {
  prefix: ImageFilePrefix,
  ext: ImageExtension,
  name: String
}

export type VideoFile = {
  prefix: VideoFilePrefix,
  ext: VideoExtension,
  name: String
}

export type DocumentFile = {
  prefix: DocumentFilePrefix,
  ext: DocumentExtension,
  name: String
}

export type File = ImageFile | VideoFile | DocumentFile

/**
 * Matches the file type with actual prefix
 *
 * @param fileType - The type of FilePrefix entity
 * @returns The actual file type prefix for path
 */
type GetFileTypePrefix = (fileType: FILE_TYPE) => FILE_TYPE_PREFIX
const getFileTypePrefix: GetFileTypePrefix = (fileType) =>
  match (fileType)
    .with(FILE_TYPE.IMAGE, () => FILE_TYPE_PREFIX.IMAGE)
    .with(FILE_TYPE.VIDEO, () => FILE_TYPE_PREFIX.VIDEO)
    .with(FILE_TYPE.DOCUMENT, () => FILE_TYPE_PREFIX.DOCUMENT)
    .exhaustive()

/**
 * Returns the FilePrefix string path
 *
 * @param filePrefix - The FilePrefix entity
 * @returns The string path from FilePrefix entity
 */
export type GetFilePrefixStringPath = (filePrefix: FilePrefix) => string
export const getFilePrefixStringPath: GetFilePrefixStringPath = (filePrefix) => {
  return `${filePrefix.service}/${filePrefix.owner}/${getFileTypePrefix(filePrefix.type)}`
}

export const getFileNameStringPath = (file: File): string => {
  return `${file.name}.${file.ext}`
}

export const getFileURLStringPath = (file: File): string => {
  return `${getFilePrefixStringPath(file.prefix)}/${getFileNameStringPath(file)}`
}

const createImageFilePrefix = (service: ServicePrefix, owner: String): ImageFilePrefix => ({ service, owner, type: FILE_TYPE.IMAGE })
const createVideoFilePrefix = (service: ServicePrefix, owner: String): VideoFilePrefix => ({ service, owner, type: FILE_TYPE.VIDEO })
const createDocumentFilePrefix = (service: ServicePrefix, owner: String): DocumentFilePrefix => ({ service, owner, type: FILE_TYPE.DOCUMENT })

export const createFilePrefix = (service: ServicePrefix, owner: String, type: FileType): FilePrefix => 
  match(type)
    .with(FILE_TYPE.IMAGE, (_) => createImageFilePrefix(service, owner))
    .with(FILE_TYPE.VIDEO, (_) => createVideoFilePrefix(service, owner))
    .with(FILE_TYPE.DOCUMENT, (_) => createDocumentFilePrefix(service, owner))
    .exhaustive()

const isPrefix = (type: FILE_TYPE) => (prefix: FilePrefix) => prefix.type === type
const isImageFilePrefix = isPrefix(FILE_TYPE.IMAGE)
const isVideoFilePrefix = isPrefix(FILE_TYPE.VIDEO)
const isDocumentFilePrefix = isPrefix(FILE_TYPE.DOCUMENT)

const isImageExtension = (ext: FileExtension): ext is ImageExtension =>
  ext === IMAGE_FILE_EXTENSION.JPG || ext === IMAGE_FILE_EXTENSION.PNG

const isVideoExtension = (ext: FileExtension): ext is VideoExtension =>
  ext === VIDEO_FILE_EXTENSION.MP4

const isDocumentExtension = (ext: FileExtension): ext is DocumentExtension =>
  ext === DOCUMENT_FILE_EXTENSION.PDF || ext === DOCUMENT_FILE_EXTENSION.TXT

const createImagefile = (prefix: ImageFilePrefix, name: String, ext: ImageExtension): Either<string, ImageFile> => {
  if(!isImageFilePrefix) return left("Invalid Prefix")
  if(!isImageExtension) return left("Invalid Extension")
  return right({ prefix, ext, name })
}

// export const createFile = (prefix: FilePrefix, name: String, ext: FileExtension): Either<string, File> =>
//   match(ext)
//     .with(IMAGE_FILE_EXTENSION.JPG || IMAGE_FILE_EXTENSION.PNG, (_) => createImagefile(prefix as ImageFilePrefix, name, ext as ImageExtension))
//     .with(VIDEO_FILE_EXTENSION.MP4, (_) => ({prefix: prefix as VideoFilePrefix, ext: ext as VideoExtension, name: name }))
//     .with(DOCUMENT_FILE_EXTENSION.TXT || DOCUMENT_FILE_EXTENSION.PDF, (_) => ({ prefix: prefix as DocumentFilePrefix, ext: ext as DocumentExtension, name: name }))
//     .exhaustive()

// const image_prefix = createFilePrefix("user" as ServicePrefix, "uid", FILE_TYPE.IMAGE)
// createFile(image_prefix, "something", IMAGE_FILE_EXTENSION.JPG)
// createFile(image_prefix, "something", VIDEO_FILE_EXTENSION.MP4)
type CreateFile = (
  service: ServicePrefix,
  ownerID: string,
  type: FileType,
  name: string,
  ext: FileExtension
) => Either<string, File>