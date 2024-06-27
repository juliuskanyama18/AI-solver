import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const app = express();
const port = 3000;

app.use(express.static("public"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: 'sk-proj-dk5Jk2TZq97YhiPxV0lYT3BlbkFJj6CiYZZShu0HuE8uNGHj', // Replace with your OpenAI API key
});

// Endpoint to handle AI responses
app.post('/generate-response', async (req, res) => {
  const prompt = req.body.prompt;
  const pageContent = req.body.pageContent;
  
  //console.log('Received prompt:', prompt); // Log the prompt value

  try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Use the desired OpenAI model
          messages: [
            { role: 'user', content: prompt },
            { role: 'assistant', content: pageContent }
          ],
          max_tokens: 1000
      });

      const aiResponse = response.choices[0].message.content.trim();
      res.json({ reply: aiResponse });
  } catch (error) {
      console.error('Error generating AI response:', error);

      let errorMessage = 'Error generating AI response';
      if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message;
      }

      res.status(500).json({ error: errorMessage });
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
