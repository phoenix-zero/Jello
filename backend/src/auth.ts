import { Router } from 'express';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { exit } from 'process';
import { User } from './models/User';

const { GOOGLE_CONSUMER_KEY, GOOGLE_CONSUMER_SECRET, HOST } = process.env;

if (!(GOOGLE_CONSUMER_KEY && GOOGLE_CONSUMER_SECRET)) exit(-1);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CONSUMER_KEY,
      clientSecret: GOOGLE_CONSUMER_SECRET,
      callbackURL: `${HOST}/auth/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await User.findOne({
          where: {
            email: profile.emails?.find(
              email =>
                (
                  email as {
                    value: string;
                    verified: boolean;
                  }
                ).verified,
            )?.value,
          },
        });
        if (!user) {
          const user = await User.create({
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            email: profile.emails?.find(
              email =>
                (
                  email as {
                    value: string;
                    verified: boolean;
                  }
                ).verified,
            )?.value,
          });
          done(null, user);
        } else {
          user.update({
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
          });
          done(null, user);
        }
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
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
  },
);

authRouter.get('/logout', (req, res) => {
  req.logOut();
  res.send(true);
});

export default (app: { use: Router['use'] }): void => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/auth', authRouter);
};
