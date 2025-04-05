import express from 'express'; // express framework for connecting to server
import path from 'path'; // used for file paths
import { fileURLToPath } from 'url'; // convert file URL to path

import session from 'express-session'; // for session management
import passport from './auth/passport.js'; // import passport configuration
import authRoutes from './auth/routes.js'; // import auth routes

const app = express();

// use environment variable or default to localhost:3000
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// deliver static files from customer_ui directory to the browser.
app.use(express.static(path.join(__dirname, 'customer_ui')));

app.use(express.json());

// Session setup BEFORE passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
		saveUninitialized: false,
	})
);

// initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
console.log('Auth routes mounted at /auth');

// landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
/**
 * @author Miles
 */
// Using routers to access query calls
import menuRouter from './db/menu.mjs';
app.use('/menu', menuRouter);
import orderRouter from './db/orders.mjs';
app.use('/order', orderRouter);

console.log('Auth routes mounted at /auth');

// starts server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
