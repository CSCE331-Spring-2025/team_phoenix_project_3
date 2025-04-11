import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';

//console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
//console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

const callbackURL = process.env.NODE_ENV === 'production' 
  ? "https://team-phoenix-project-3.onrender.com/auth/google/callback"
  : "http://localhost:3000/auth/google/callback";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  },
  (accessToken, refreshToken, profile, done) => {
    console.log("User authenticated:", profile);
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;