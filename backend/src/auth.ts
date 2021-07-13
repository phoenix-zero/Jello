import { Router } from 'express';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { exit } from 'process';

const { GOOGLE_CONSUMER_KEY, GOOGLE_CONSUMER_SECRET, HOST } = process.env;

if (!(GOOGLE_CONSUMER_KEY && GOOGLE_CONSUMER_SECRET)) exit(-1);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CONSUMER_KEY,
      clientSecret: GOOGLE_CONSUMER_SECRET,
      callbackURL: `${HOST}/auth/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken, profile);
      done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id as string);
});

const authRouter = Router();

authRouter.get(
  '/',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

authRouter.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.ALLOW_ORIGIN,
  }),
  (req, res) => {
    console.log(req.user);
    res.redirect(process.env.ALLOW_ORIGIN ?? '/graphql');
    // res.send(req.user);
  },
);

authRouter.get('/profile', (req, res) => {
  req.user ? res.send(req.user) : res.status(401).send('Not logged in');
});

authRouter.get('/logout', (req, res) => {
  req.logOut();
  res.send(true);
});

export default (app: Router): void => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/auth', authRouter);
};
