import { File } from '../file.entity';

type saveImageFile = (file: File) => String

export interface fileAdapter {
  saveImageFile: saveImageFile
  
}