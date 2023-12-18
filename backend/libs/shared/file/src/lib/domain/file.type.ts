export enum FILE_EXTENSION {
  JPG = "jpg",
  PNG = "png",
  MP4 = "mp4",
  TXT = "txt",
  PDF = "pdf"
}

export enum FILE_TYPE {
  IMAGE = "images",
  VIDEO = "videos",
  DOCUMENT = "documents"
}

export enum SERVICE_PREFIX {
  USER = "user",
  POST = "post",
}

export type ServicePrefix = string

export type ImageExtension = FILE_EXTENSION.JPG | FILE_EXTENSION.PNG;
export type VideoExtension = FILE_EXTENSION.MP4;
export type DocumentExtension = FILE_EXTENSION.TXT | FILE_EXTENSION.PDF;

export type FilePath =
  | { type: FILE_TYPE.IMAGE, servicePrefix: ServicePrefix, ext: ImageExtension, name: String }
  | { type: FILE_TYPE.VIDEO, servicePrefix: ServicePrefix, ext: VideoExtension, name: String }
  | { type: FILE_TYPE.DOCUMENT, servicePrefix: ServicePrefix, ext: DocumentExtension, name: String };

