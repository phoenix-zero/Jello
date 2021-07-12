import { Router, Express } from 'express';
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
  // User.findById(id, function (err, user) {
  //   done(err, user);
  // });
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
  passport.authenticate('google', { failureRedirect: '/auth/fail' }),
  (_req, res) => {
    res.redirect('/');
  },
);

authRouter.get('/fail', (_req, res) => {
  res.send('Hol up');
});

export default (app: Express): void => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/auth', authRouter);
};
