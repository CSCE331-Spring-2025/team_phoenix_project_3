/* 
Notes to understand these external APIs:

- Express (web app framework for Node.js) uses routes to define server responses for specific requests
- route includes HTTP method (GET, POST, etc.), URL path (/menu or /chat/recommend), and handler/callback function to handle the request

- instead of directly stuffing every route in index.js, we can organize it in these separate files
- then in index.js just app.use('/chat', chatbotRoutes);

*/
import express from 'express';

const router = express.Router();

const HF_API_URL = 'https://router.huggingface.co/novita/v3/openai/chat/completions';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // Store your token in .env

// POST /chat/recommend
router.post('/recommend', async (req, res) => {
    const userMessage = req.body.prompt;

    try {
        // fetch drink menu from the backend
        const menuRes = await fetch('http://localhost:3000/menu/items');
        const menuJson = await menuRes.json();
        const drinkList = Array.isArray(menuJson)
            ? menuJson.map(item => item.item_name).join(', ')
            : '';

        const prompt = `Here is our drink menu: ${drinkList}.
                        Customer request: "${userMessage}"
                        Please recommend one specific drink that matches the request.`;

        const payload = {
            provider: "novita",
            model: "deepseek/deepseek-v3-0324",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        const hfRes = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await hfRes.json();
        console.log("Raw response:", data);

        console.log("Message object:", data.choices[0].message);

        const reply = data.choices?.[0]?.message?.content || "I'm not sure what to suggest.";
        res.json({ reply });
    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({ reply: "Sorry, I had trouble thinking of something!" });
    }
});

export default router;
