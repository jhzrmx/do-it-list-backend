import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.provider = "google";
          user.imageUrl = profile.photos?.[0].value || user.imageUrl;
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          fullName: profile.displayName,
          email: profile.emails?.[0].value,
          imageUrl: profile.photos?.[0].value || null,
          provider: "google",
          googleId: profile.id,
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
