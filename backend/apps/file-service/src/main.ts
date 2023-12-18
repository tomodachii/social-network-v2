import express from 'express';
import path from 'path'
import multer from 'multer'
import { uploadRouter } from './file/interface-adapter'
import { saveFileData } from './file/infrastructure/file.repository';
import * as E from 'fp-ts/lib/Either'

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3006;

const app = express();
const upload = multer()

// app.get('/', (req, res) => {
//   res.send({ message: path.join(__dirname, '..', 'data') });
//   console.log(path.join(__dirname, '..', 'data'))
// });

// app.listen(port, host, () => {
//   console.log(`[ ready ] http://${host}:${port}`);
// });

import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';

app.use(express.json());

// Simulated storage for file statuses
const fileStatuses = new Map();

// Endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    // Simulated upload processing (async file write)
    const fileId = uuidv4(); // Generate a unique ID for the file
    const fileName = `${fileId}.txt`; // Use unique ID as file name or use original file name

    // Simulated async file write operation
    const file: Express.Multer.File = req.file
    // await writeFile(fileName, file.buffer, 'utf8');
    console.log(file)
    console.log(path.join(__dirname, '..'))
    saveFileData(path.join(__dirname, '..', 'data'), fileName)(file)().then(either => E.fold(console.log, console.log)(either))

    // Store file status as UPLOADING initially
    fileStatuses.set(fileId, 'UPLOADING');

    // Return response with file ID for status checking
    res.status(200).json({ fileId });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

// Endpoint to check file status
app.get('/status/:fileId', (req, res) => {
  const { fileId } = req.params;
  const status = fileStatuses.get(fileId);

  if (status) {
    res.status(200).json({ status });
  } else {
    res.status(404).send('File status not found');
  }
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

