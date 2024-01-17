import { 
  IMAGE_FILE_EXTENSION, 
  VIDEO_FILE_EXTENSION, 
  DOCUMENT_FILE_EXTENSION, 
  FILE_TYPE_PREFIX,
  FILE_DOMAIN_EXCEPTION,
  MIMETYPE
} from "./file.type";
import { Opaque } from '@lib/shared/common/types'
import { match } from 'ts-pattern'
import { Either, left, right } from 'fp-ts/lib/Either'
import * as E from 'fp-ts/lib/Either'

export type ServicePrefix = Opaque<string, 'ServicePrefix'>

export type FilePrefix = {
  service: ServicePrefix,
  owner: string
}

export type ImageExtension = IMAGE_FILE_EXTENSION.JPG | IMAGE_FILE_EXTENSION.PNG | IMAGE_FILE_EXTENSION.JPEG;
export type VideoExtension = VIDEO_FILE_EXTENSION.MP4;
export type DocumentExtension = DOCUMENT_FILE_EXTENSION.TXT | DOCUMENT_FILE_EXTENSION.PDF;

export type FileExtension = ImageExtension | VideoExtension | DocumentExtension

export type ImageFile = {
  prefix: FilePrefix,
  ext: ImageExtension,
  name: string,
  size: number
}

export type VideoFile = {
  prefix: FilePrefix,
  ext: VideoExtension,
  name: string,
  size: number
}

export type DocumentFile = {
  prefix: FilePrefix,
  ext: DocumentExtension,
  name: string,
  size: number
}

export type File = ImageFile | VideoFile | DocumentFile

/**
 * Matches the file type with actual prefix
 *
 * @param ext - The mimetype of file for example: 'image/png'
 * @returns The actual file type prefix for path
 */
type CreateFileTypePrefixFromExtension = (ext: FileExtension) => Either<string, FILE_TYPE_PREFIX>
const createFileTypePrefixFromExtension: CreateFileTypePrefixFromExtension = (ext) =>
  match (ext)
    .with(IMAGE_FILE_EXTENSION.JPG, IMAGE_FILE_EXTENSION.PNG, IMAGE_FILE_EXTENSION.JPEG, () => right(FILE_TYPE_PREFIX.IMAGE))
    .with(VIDEO_FILE_EXTENSION.MP4, () => right(FILE_TYPE_PREFIX.VIDEO))
    .with(DOCUMENT_FILE_EXTENSION.PDF, DOCUMENT_FILE_EXTENSION.TXT, () => right(FILE_TYPE_PREFIX.DOCUMENT))
    .otherwise(() => left(FILE_DOMAIN_EXCEPTION.INVALID_FILE_EXTENSION))

/**
 * Returns the FilePrefix string path
 *
 * @param filePrefix - The FilePrefix entity
 * @returns The string path from FilePrefix entity
 */
type GetFilePrefixStringPath = (filePrefix: FilePrefix) => string
const getFilePrefixStringPath: GetFilePrefixStringPath = (filePrefix) => {
  return `${filePrefix.service}/${filePrefix.owner}`
}

export const getFileNameStringPath = (file: File): string => {
  return `${file.name}.${file.ext}`
}

export const getFileURL = (file: File): Either<string, string> => {
  const fileTypePrefixEither = createFileTypePrefixFromExtension(file.ext)
  return E.match(
    (err: string) => left(err),
    (fileTypePrefix) => right(`${getFilePrefixStringPath(file.prefix)}/${fileTypePrefix}/${getFileNameStringPath(file)}`)
  )(fileTypePrefixEither)
}

export const getFilePath = (file: File): Either<string, string> => {
  const fileTypePrefixEither = createFileTypePrefixFromExtension(file.ext)
  return E.match(
    (err: string) => left(err),
    (fileTypePrefix) => right(`/${getFilePrefixStringPath(file.prefix)}/${fileTypePrefix}`)
  )(fileTypePrefixEither)
}

const createFilePrefix = (service: ServicePrefix, owner: string): FilePrefix => ({
  service,
  owner
})

const createImagefile = (prefix: FilePrefix, name: string, ext: ImageExtension, size: number): Either<string, ImageFile> => {
  // validate size and encoding, can even do pattern matching case png, jpg ...
  return right({ prefix, ext, name, size })
}

const createVideoFile = (prefix: FilePrefix, name: string, ext: VideoExtension, size: number): Either<string, VideoFile> => {
  // validate size and encoding
  return right({ prefix, ext, name, size })
}

const createDocumentFile = (prefix: FilePrefix, name: string, ext: DocumentExtension, size: number): Either<string, DocumentFile> => {
  // validate size and encoding
  return right({ prefix, ext, name, size })
}

type CreateExtFromMimeType = (mimetype: string) => Either<string, FileExtension>
const createExtFromMimeType: CreateExtFromMimeType = (mimetype) =>
  match(mimetype)
    .with(MIMETYPE.APPLICATION_PDF, () => right(DOCUMENT_FILE_EXTENSION.PDF))
    .with(MIMETYPE.IMAGE_JPEG, () => right(IMAGE_FILE_EXTENSION.JPEG))
    .with(MIMETYPE.IMAGE_JPG, () => right(IMAGE_FILE_EXTENSION.JPG))
    .with(MIMETYPE.IMAGE_PNG, () => right(IMAGE_FILE_EXTENSION.PNG))
    .with(MIMETYPE.TEXT_PLAIN, () => right(DOCUMENT_FILE_EXTENSION.TXT))
    .with(MIMETYPE.VIDEO_MP4, () => right(VIDEO_FILE_EXTENSION.MP4))
    .otherwise((mimetype) => left(`Invalid or non supported mimetype ${mimetype}`))

type CreateFile = (
  service: ServicePrefix,
  ownerID: string,
  name: string,
  mimetype: string,
  size: number
) => Either<string, File>

export const createFile: CreateFile = (service, ownerID, name, mimetype, size): Either<string, File> => {
  const prefix = createFilePrefix(service, ownerID)
  const extEither = createExtFromMimeType(mimetype)
  return E.match(
    (err: string) => left(err),
    (ext: FileExtension) => match(ext)
      .with(IMAGE_FILE_EXTENSION.JPG, IMAGE_FILE_EXTENSION.PNG, IMAGE_FILE_EXTENSION.JPEG, (_) => createImagefile(prefix, name, ext as ImageExtension, size))
      .with(VIDEO_FILE_EXTENSION.MP4, (_) => createVideoFile(prefix, name, ext as VideoExtension, size))
      .with(DOCUMENT_FILE_EXTENSION.TXT, DOCUMENT_FILE_EXTENSION.PDF, (_) => createDocumentFile(prefix, name, ext as DocumentExtension, size))
      .exhaustive()
  )(extEither)
}