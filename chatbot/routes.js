/* 
Notes to understand these external APIs:

- Express (web app framework for Node.js) uses routes to define server responses for specific requests
- route includes HTTP method (GET, POST, etc.), URL path (/menu or /chat/recommend), and handler/callback function to handle the request

- instead of directly stuffing every route in index.js, we can organize it in these separate files
- then in index.js just app.use('/chat', chatbotRoutes);
process.env.HUGGINGFACE_API_KEY
*/
import express from 'express';
import { InferenceClient } from "@huggingface/inference";

const router = express.Router();
const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

router.post('/recommend', async (req, res) => {
  const userMessage = req.body.prompt;

  try {
    const menuRes = await fetch('https://team-phoenix-project-3.onrender.com/menu/items');
    const menuJson = await menuRes.json();
    const drinkList = Array.isArray(menuJson)
      ? menuJson.map(item => item.item_name).join(', ')
      : '';

    const prompt = `
        You are a friendly boba tea chatbot helping customers choose drinks from the menu.

        Menu: ${drinkList}
        Customer message: "${userMessage}"

        Reply with a clear recommendation that fits their request.
        Speak directly to the customer (use "you", not "the customer").
        Do not use any formatting, markdown, or asterisks.
        Explain why the recommended drink is a good match in 1-2 sentences.
        If the customer changes their request or adds to it, keep the conversation flowing naturally.
    `;

    let out = '';
    const stream = await client.chatCompletionStream({
        provider: "cerebras",
        model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        top_p: 0.7,
        max_tokens: 2048,
      });

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content || '';
      out += content;
    }

    res.json({ reply: out || "I'm not sure what to suggest." });

  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ reply: "Sorry, I had trouble thinking of something!" });
  }
});

export default router;
