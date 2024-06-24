import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';



const app=express();
const port=3000;

app.use(express.static("public"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("home.ejs");
  });
  app.get('/courseList', (req, res) => {
    res.render("courseList.ejs");
  });
  app.get('/_Introduction%20to%20Limits', (req, res) => {
    res.render("_Introduction to Limits.ejs");
  });
  app.get('/limitLaws', (req, res) => {
    res.render("limitLaws.ejs");
  });

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});


