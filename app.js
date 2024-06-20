import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';



const app=express();
const port=3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
  });
  app.get('/courseList.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'courseList.html'));
  });
  app.get('/_Introduction to Limits.html', (req, res) => {
    res.sendFile(path.join(__dirname, '_Introduction to Limits.html'));
  });

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});


