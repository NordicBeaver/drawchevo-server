import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hi! This is drawchevo.');
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
