import { IMAGE_FILE_EXTENSION, VIDEO_FILE_EXTENSION, DOCUMENT_FILE_EXTENSION, FILE_TYPE } from "./file.type";
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

export const getFilePrefixString = (filePrefix: FilePrefix): string => {
  return `${filePrefix.service}/${filePrefix.owner}/${filePrefix.type}`
}

export const getFileNameString = (file: File): string => {
  return `${file.name}.${file.ext}`
}

export const getFileURLString = (file: File): string => {
  return `${getFilePrefixString(file.prefix)}/${getFileNameString(file)}`
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

export const createFile = (prefix: FilePrefix, name: String, ext: FileExtension): File =>
  match(ext)
    .with(IMAGE_FILE_EXTENSION.JPG || IMAGE_FILE_EXTENSION.PNG, (_) => ({ prefix: prefix as ImageFilePrefix, ext: ext as ImageExtension, name: name }))
    .with(VIDEO_FILE_EXTENSION.MP4, (_) => ({prefix: prefix as VideoFilePrefix, ext: ext as VideoExtension, name: name }))
    .with(DOCUMENT_FILE_EXTENSION.TXT || DOCUMENT_FILE_EXTENSION.PDF, (_) => ({ prefix: prefix as DocumentFilePrefix, ext: ext as DocumentExtension, name: name }))
    .exhaustive()