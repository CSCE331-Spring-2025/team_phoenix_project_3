import express from 'express';
import passport from './passport.js';

import { callSqlFunction } from '../db/utils.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// start the Google login
router.get('/google', (req, res, next) => {
    const role = req.query.role || 'customer';
    console.log("Role passed to Google:", role);

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: role // pass role through Google safely using 'state'
    })(req, res, next);
});


// handle Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const role = req.query.state || 'customer'; // google sends the 'state' back here
        const email = req.user.emails[0].value;
        console.log("Google callback received role:", role);

        try {
            const result = await callSqlFunction('get_employee_by_email', [email]);
            const employee = result.success ? result.data[0].get_employee_by_email : null;

            if (employee?.is_manager) {
                req.session.role = 'manager';
            } else if (employee) {
                req.session.role = 'cashier';
            } else {
                req.session.role = 'customer';
            }
        } catch (err) {
            console.error('Error checking employee role:', err);
            req.session.role = roleFromState; // fallback
        }

        res.redirect('/'); // back to homepage after login
    }
);

// Route to get user info
router.get('/user', (req, res) => {
    if (req.user) {
        res.json({
            name: req.user.displayName,
            email: req.user.emails[0].value,
            role: req.session.role,
        });
    } else {
        res.json({ name: "Guest" });
    }
});

// Route to log out the user
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { console.error('Logout error:', err); }
        req.session.destroy();
        res.redirect('/');
    });
});

// restrict manager-only access
function authManager(req, res, next) {
    console.log('authManager called. Session role:', req.session.role); // debug log
    if (req.session.role !== 'manager') {
        return res.status(403).sendFile(path.join(__dirname, '../managementUI/403.html'));
    }
    next();
}

// restrict cashier-only access
function authCashier(req, res, next) {
    if (req.session.role !== 'cashier' && req.session.role !== 'manager') {
        return res.status(403).sendFile(path.join(__dirname, '../cashier_ui/403.html'));
    }
    next();
}

export {authManager, authCashier};

export default router;
