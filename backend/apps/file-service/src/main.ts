import express from 'express';
import multer from 'multer'
import { uploadRouter } from './file/interface-adapter'

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3006;

const app = express();
const upload = multer()

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/upload', upload.single('file'), uploadRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

