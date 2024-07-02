import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import session from 'express-session';

const app = express();
const port = 3000;

app.use(express.static("public"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(session({
    secret: 'AITUTOR', // Replace with a secure session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use true in production with HTTPS
}));

app.get('/', (req, res) => {
    res.render("home.ejs");
});

app.get('/courseList', (req, res) => {
    res.render("courseList.ejs");
});

app.get('/chapter1', (req, res) => {
    res.render("chapter1.ejs");
});

app.get('/limitLaws', (req, res) => {
    res.render("limitLaws.ejs");
});

const openai = new OpenAI({
    apiKey: 'sk-proj-dk5Jk2TZq97YhiPxV0lYT3BlbkFJj6CiYZZShu0HuE8uNGHj', // Replace with your OpenAI API key
});

app.post('/generate-response', async (req, res) => {
    const prompt = req.body.prompt;
    const instruction = "Let's solve this step by step together. Please help me understand each part by asking me questions and giving hints so I can learn as we go on.";

    // Initialize conversation history for the session if it doesn't exist
    if (!req.session.conversationHistory) {
        req.session.conversationHistory = [];
    }

    try {
         // Combine the instruction with the user's prompt
         const fullPrompt = `${instruction} ${prompt}`;
         
        const response = await openai.chat.completions.create({
            model: "gpt-4", // Use the desired OpenAI model
            messages: req.session.conversationHistory.concat({ role: 'user', content: fullPrompt }),
            max_tokens: 200
        });

        const aiResponse = response.choices[0].message.content.trim();

        // Update conversation history with latest message and response
        req.session.conversationHistory.push({ role: 'user', content: prompt });
        req.session.conversationHistory.push({ role: 'assistant', content: aiResponse });

        res.json({ reply: aiResponse });
    } catch (error) {
        console.error('Error generating AI response:', error);

        let errorMessage = 'Error generating AI response';
        if (error.code === 'insufficient_quota') {
            errorMessage = 'You have exceeded your current quota. Please check your plan and billing details.';
        }

        res.status(500).json({ error: errorMessage });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
