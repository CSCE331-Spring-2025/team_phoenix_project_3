import express from 'express'; // express framework for connecting to server
import path from 'path'; // used for file paths
import { fileURLToPath } from 'url'; // convert file URL to path

import session from 'express-session'; // for session management
import passport from './auth/passport.js'; // import passport configuration
import authRoutes from './auth/routes.js'; // import auth routes
import { authManager, authCashier } from './auth/routes.js';

import weatherRoutes from './weather/routes.js'; // import weather routes

import chatbotRoutes from './chatbot/routes.js'; // import chatbot routes


const app = express();

// use environment variable or default to localhost:3000
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Session setup BEFORE passport
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

// initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// deliver static files from the 3 UI directories to the browser.
app.use(express.static(path.join(__dirname, 'customer_ui')));
app.use(express.static(path.join(__dirname, 'managementUI')));
app.use(express.static(path.join(__dirname, 'cashier_ui')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRoutes);
console.log('Google Login API: routes mounted at /auth');

app.use('/weather', weatherRoutes);
console.log('Weather API: routes mounted at /weather');

app.use('/chat', chatbotRoutes);
console.log('Chatbot API: routes mounted at /chat');

// landing page
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * @author Miles
 */
// Using routers to access query calls
import inventoryRouter from './db/inventory.mjs';
app.use('/inventory', inventoryRouter);
import menuRouter from './db/menu.mjs';
app.use('/menu', menuRouter);
import orderRouter from './db/orders.mjs';
app.use('/order', orderRouter);
import employeeRouter from './db/employee.mjs';
app.use('/employee', employeeRouter);
import reportRouter from './db/reports.mjs';
app.use('/report', reportRouter);

// starts server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
