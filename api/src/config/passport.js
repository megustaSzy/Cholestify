import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { prisma } from "../lib/prisma.js";

import { ROLE } from "../constants/role.constant.js";

import { generatePatientCode } from "../utils/generate-patient-code.util.js";

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

        // cek user berdasarkan google id
        let user = await prisma.user.findUnique({
          where: {
            googleId,
          },
        });

        // jika belum ada
        if (!user) {
          // cek apakah email sudah terdaftar
          user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          // jika email sudah ada -> link akun google
          if (user) {
            user = await prisma.user.update({
              where: {
                id: user.id,
              },

              data: {
                googleId,
              },
            });
          } else {
            // create user baru
            let createdUser;

            for (let i = 0; i < 5; i++) {
              try {
                createdUser = await prisma.user.create({
                  data: {
                    patientId: generatePatientCode(),

                    nama,
                    email,
                    googleId,

                    role: ROLE.USER,
                  },
                });

                break;
              } catch (error) {
                // retry jika patientId duplicate
                if (error.code === "P2002") {
                  continue;
                }

                throw error;
              }
            }

            if (!createdUser) {
              throw new Error("Failed generate patient ID");
            }

            user = createdUser;
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
