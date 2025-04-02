import express from 'express'; // express framework for connecting to server
import path from 'path'; // used for file paths
import { fileURLToPath } from 'url'; // convert file URL to path

const app = express();

// use environment variable or default to localhost:3000
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// deliver static files from customer_ui directory to the browser.
app.use(express.static(path.join(__dirname, 'customer_ui')));

// index.js
app.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/customer_ui/customer_ui.html');
    } else {
        res.redirect('/auth/google');
    }
});

app.use(express.json());

// Using routers to access query calls
import menuRouter from './db/menu.mjs';
app.use('/menu', menuRouter);

// starts server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
