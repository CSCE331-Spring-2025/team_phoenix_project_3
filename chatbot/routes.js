/* 
Notes to understand these external APIs:

- Express (web app framework for Node.js) uses routes to define server responses for specific requests
- route includes HTTP method (GET, POST, etc.), URL path (/menu or /chat/recommend), and handler/callback function to handle the request

- instead of directly stuffing every route in index.js, we can organize it in these separate files
- then in index.js just app.use('/chat', chatbotRoutes);

*/

import express from 'express';

const router = express.Router();

const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // Stored in .env

// POST /chat/recommend
router.post('/recommend', async (req, res) => {
    const userMessage = req.body.prompt;

    try {
        // Send user message to Hugging Face model
        const hfRes = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: userMessage })
        });

        const data = await hfRes.json();
        const reply = data.generated_text || "Hmm, I'm not sure what to suggest.";

        res.json({ reply }); // Send response back to frontend
    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({ reply: "Sorry, I had trouble thinking of something!" });
    }
});

export default router;
