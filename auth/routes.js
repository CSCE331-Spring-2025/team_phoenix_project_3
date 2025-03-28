import express from 'express';
import passport from './passport.js';

const router = express.Router();

// start the Google login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// handle Google OAuth callback
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/customer_ui/customer_ui.html');
    }
);

// Route to get user info
router.get('/auth/user', (req, res) => {
    if (req.user) {
        res.json({ name: req.user.displayName });
    } else {
        res.json({ name: "Guest" });
    }
});


export default router;
