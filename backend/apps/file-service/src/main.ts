import express from 'express';
import path from 'path'
import multer from 'multer'
import { uploadRouter } from './file/interface-adapter'

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
app.post('/upload', upload.single('file'), );

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

