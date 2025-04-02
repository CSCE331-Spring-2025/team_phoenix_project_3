import express from 'express';
import passport from './passport.js';

const router = express.Router();

// start the Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// handle Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
      successRedirect: '/customer_ui.html',
      failureRedirect: '/'
    })
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
