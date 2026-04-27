import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma.js";
import { ROLE } from "../constants/role.constant.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const nama = profile.displayName;
        const googleId = profile.id;

        // Cek apakah user sudah ada berdasarkan googleId
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        if (!user) {
          // Cek apakah email sudah terdaftar (register biasa)
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link google ke akun yang sudah ada
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId },
            });
          } else {
            // Buat user baru
            user = await prisma.user.create({
              data: {
                nama,
                email,
                googleId,
                role: ROLE.USER,
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
