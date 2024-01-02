let fileStatus: { [key: string]: string } = {};

export const getFileStatus = (fileId: string) => fileStatus[fileId];
export const setFileStatus = (fileId: string, status: string) => {
  fileStatus[fileId] = status;
};
