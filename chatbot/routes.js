/* 
Notes to understand these external APIs:

- Express (web app framework for Node.js) uses routes to define server responses for specific requests
- route includes HTTP method (GET, POST, etc.), URL path (/menu or /chat/recommend), and handler/callback function to handle the request

- instead of directly stuffing every route in index.js, we can organize it in these separate files
- then in index.js just app.use('/chat', chatbotRoutes);

*/

