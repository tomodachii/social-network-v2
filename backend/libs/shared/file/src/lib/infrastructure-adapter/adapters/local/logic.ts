import { ServicePrefix, createFilePrefix, createFile, getFilePathString, FILE_TYPE, FileExtension } from '@lib/shared/file/domain'
import axios from 'axios'

export const saveFile = (service: ServicePrefix, ownerID: String, fileType: FILE_TYPE, fileName: String, fileExt: FileExtension) => {
  const prefix = createFilePrefix(service, ownerID, fileType)
  const file = createFile(prefix, fileName, fileExt)
  const filePath = getFilePathString(file)

  axios.post('http://localhost:3006/upload')
}