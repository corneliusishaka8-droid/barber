import express from "express"
import db from "../db.js"
import bcrypt from "bcrypt"
import passport, { googleOAuthEnabled } from "../passport.js"

const router = express.Router()
const saltRounds = 10

function publicUser(user) {
  return { id: user.id, fullName: user.full_name, username: user.username }
}

function getFrontendOrigin(req) {
  const configuredOrigin = process.env.FRONTEND_ORIGIN?.split(",")[0]?.trim()
  try {
    if (configuredOrigin) return new URL(configuredOrigin).origin
  } catch {
    // Fall back to this server when no valid frontend origin is configured.
  }
  if (process.env.NODE_ENV !== "production") return "http://localhost:5173"
  return `${req.protocol}://${req.get("host")}`
}

function getSafeReturnPath(value, frontendOrigin) {
  if (typeof value !== "string") return "/profile"
  try {
    const destination = new URL(value, frontendOrigin)
    if (destination.origin !== frontendOrigin) return "/profile"
    return `${destination.pathname}${destination.search}${destination.hash}`
  } catch {
    return "/profile"
  }
}

router.post("/register", async (req, res) => {
  const { fullName, username, password } = req.body ?? {}
  if (![fullName, username, password].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "Full name, username, and password are required." })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    await db.query("INSERT INTO users (full_name, username, password_hash) VALUES ($1, $2, $3)", [fullName.trim(), username.trim().toLowerCase(), hashedPassword])
    return res.status(201).json({ message: "Your account is ready. Sign in to continue." })
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ message: "That username is already in use. Choose another one." })
    console.error("Registration failed:", error.message)
    return res.status(500).json({ message: "We could not create your account. Please try again." })
  }
})

router.post("/contact", (req, res) => {
  const { submissionType = "contact", name, email, subject = "", message, selectedStyle = "", inquiryTitle = "" } = req.body ?? {}

  if (submissionType === "booking" && !req.isAuthenticated?.()) {
    return res.status(401).json({ message: "Sign in before sending a booking request." })
  }
  if (![name, email, message].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "Name, email, and message are required." })
  }

  console.log(`\n[${submissionType === "booking" ? "BOOKING" : "CONTACT"}] New ${submissionType} submission`)
  console.log(`  Name:    ${name.trim()}`)
  console.log(`  Email:   ${email.trim()}`)
  if (typeof subject === "string" && subject.trim()) console.log(`  Subject: ${subject.trim()}`)
  if (selectedStyle) console.log(`  Style:   ${selectedStyle}`)
  if (inquiryTitle) console.log(`  Service: ${inquiryTitle}`)
  console.log(`  Message: ${message.trim()}`)

  return res.status(202).json({ message: "Your message was received by the studio." })
})

router.post("/login", (req, res, next) => {
  const { username, password } = req.body ?? {}
  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required." })
  }

  return passport.authenticate("local", (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.status(401).json({ message: info?.message || "Those login details could not be verified." })
    return req.logIn(user, (loginError) => {
      if (loginError) return next(loginError)
      return res.json({ message: "Login successful.", user: publicUser(user) })
    })
  })(req, res, next)
})

router.get("/auth/google", (req, res, next) => {
  const frontendOrigin = getFrontendOrigin(req)
  if (!googleOAuthEnabled) {
    return res.redirect(`${frontendOrigin}/login?auth=google-unavailable`)
  }

  req.session.oauthReturnTo = getSafeReturnPath(req.query.returnTo, frontendOrigin)
  return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next)
})

router.get("/auth/google/callback", (req, res, next) => {
  const frontendOrigin = getFrontendOrigin(req)
  if (!googleOAuthEnabled) return res.redirect(`${frontendOrigin}/login?auth=google-unavailable`)

  return passport.authenticate("google", (error, user) => {
    if (error) return next(error)
    if (!user) return res.redirect(`${frontendOrigin}/login?auth=google-failed`)

    const returnPath = getSafeReturnPath(req.session.oauthReturnTo, frontendOrigin)
    delete req.session.oauthReturnTo
    return req.logIn(user, { keepSessionInfo: true }, (loginError) => {
      if (loginError) return next(loginError)
      return req.session.save((saveError) => {
        if (saveError) return next(saveError)
        return res.redirect(new URL(returnPath, frontendOrigin).toString())
      })
    })
  })(req, res, next)
})

router.get("/session", (req, res) => {
  if (!req.isAuthenticated?.()) return res.status(401).json({ user: null })
  return res.json({ user: publicUser(req.user) })
})

router.post("/logout", (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) return next(logoutError)
    return req.session.destroy((sessionError) => {
      if (sessionError) return next(sessionError)
      res.clearCookie("connect.sid", { path: "/" })
      return res.json({ message: "You have been signed out." })
    })
  })
})

router.get("/message", (_req, res) => {
  res.json({ message: "hello world" })
})

export default router
