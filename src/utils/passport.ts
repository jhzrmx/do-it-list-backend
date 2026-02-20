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
        const email = profile.emails?.[0].value;
        const isVerified = profile.emails?.[0].verified;

        if (!email || !isVerified) {
          return done(new Error("Google email not verified"));
        }

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email });

        if (user) {
          if (!user.providers.includes("google")) {
            user.providers.push("google");
          }

          user.googleId = profile.id;
          user.imageUrl = profile.photos?.[0].value || user.imageUrl;

          await user.save();
          return done(null, user);
        }

        user = await User.create({
          fullName: profile.displayName,
          email,
          imageUrl: profile.photos?.[0].value || null,
          providers: ["google"],
          googleId: profile.id,
        });

        done(null, user);
      } catch (error) {
        done(error as Error);
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
