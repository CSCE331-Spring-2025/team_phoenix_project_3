import express from 'express';
import passport from './passport.js';

const router = express.Router();

// start the Google login
router.get('/google', (req, res, next) => {
    const role = req.query.role || 'customer';
    console.log("Role passed to Google:", role); // debug log bc this is very confusing

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: role // pass role through Google safely using 'state'
    })(req, res, next);
});


// handle Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      const role = req.query.state; // google sends the 'state' back here
      console.log("Google callback received role (state):", role);
  
      if (role === 'manager') {
          res.redirect('/delivery.html');
      } else if (role === 'cashier') {
          res.redirect('/cashier_ui.html');
      } else {
          res.redirect('/customer_landing.html');
      }
    });

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

export default router;
