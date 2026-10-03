import passport from "passport"
import bcrypt from "bcrypt"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import db from "./db.js"

export const googleOAuthCallbackURL = process.env.GOOGLE_CALLBACK_URL || (
  process.env.NODE_ENV === "production"
    ? ""
    : `http://localhost:${process.env.PORT || 3000}/api/auth/google/callback`
)
export const googleOAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  googleOAuthCallbackURL,
)

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username.trim().toLowerCase()])
        if (result.rows.length === 0) return done(null, false, { message: "User not found." })

        const user = result.rows[0]
        const isPasswordValid = await bcrypt.compare(password, user.password_hash)
        if (!isPasswordValid) return done(null, false, { message: "Incorrect password." })
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    },
  ),
)

if (googleOAuthEnabled) {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: googleOAuthCallbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const googleId = profile.id
          const email = profile.emails?.[0]?.value?.trim().toLowerCase()
          const emailIsVerified = profile._json?.email_verified === true || profile.emails?.[0]?.verified === true

          if (!googleId || !email || !emailIsVerified) {
            return done(null, false, { message: "Google must provide a verified email address." })
          }

          const googleAccount = await db.query("SELECT * FROM users WHERE google_id = $1", [googleId])
          if (googleAccount.rows.length) return done(null, googleAccount.rows[0])

          const emailAccount = await db.query("SELECT * FROM users WHERE LOWER(email) = $1", [email])
          if (emailAccount.rows.length) {
            const existingUser = emailAccount.rows[0]
            if (existingUser.google_id && existingUser.google_id !== googleId) {
              return done(null, false, { message: "This email is already linked to another Google account." })
            }

            const linkedAccount = await db.query(
              "UPDATE users SET google_id = $1, avatar_url = COALESCE($2, avatar_url), updated_at = NOW() WHERE id = $3 RETURNING *",
              [googleId, profile.photos?.[0]?.value || null, existingUser.id],
            )
            return done(null, linkedAccount.rows[0])
          }

          const fullName = profile.displayName?.trim() || email.split("@")[0]
          const createdAccount = await db.query(
            "INSERT INTO users (full_name, email, google_id, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *",
            [fullName, email, googleId, profile.photos?.[0]?.value || null],
          )
          return done(null, createdAccount.rows[0])
        } catch (error) {
          return done(error)
        }
      },
    ),
  )
}

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id])
    if (result.rows.length === 0) return done(new Error("User not found."))
    return done(null, result.rows[0])
  } catch (error) {
    return done(error)
  }
})

export default passport
