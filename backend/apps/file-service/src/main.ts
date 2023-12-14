import express from 'express';
import path from 'path'

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3006;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: path.join(__dirname, '..', 'data') });
  console.log(path.join(__dirname, '..', 'data'))
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
