import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { randomBytes } from "node:crypto"
import apiRouter from "./routes/api.js"
import db from "./db.js"
import passport from "./passport.js"
import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import "dotenv/config"

const port = Number(process.env.PORT) || 3000
const sessionSecret = process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : randomBytes(32).toString("hex"))
if (!sessionSecret) throw new Error("SESSION_SECRET must be set in production.")
const allowedFrontendOrigins = new Set((process.env.FRONTEND_ORIGIN || "").split(",").map((origin) => origin.trim()).filter(Boolean))
const PgSessionStore = connectPgSimple(session)

const app = express()
app.set("trust proxy", 1)
app.use(cors({
  origin(origin, callback) {
    const localDevelopmentOrigin = process.env.NODE_ENV !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "")
    callback(null, !origin || allowedFrontendOrigins.has(origin) || localDevelopmentOrigin)
  },
  credentials: true,
}))
app.use(express.json({ limit: "32kb" }))
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new PgSessionStore({ pool: db, createTableIfMissing: true }),
    cookie: {
      httpOnly: true,
      sameSite: process.env.SESSION_COOKIE_SAME_SITE || "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}))


app.use(passport.initialize())
app.use(passport.session())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontend = path.join(__dirname, "../frontend/barbars/dist")

app.use("/api", apiRouter)

// In production, serve the built React app from this same server.
app.use(express.static(frontend))

app.post("/api/paystack/webhook", async (req, res) => {
  const paystackSecret = process.env.PAYSTACK_SECRET
  // Handle Paystack callback logic here
})

// Return React's entry page for browser routes such as /register after a refresh.
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontend, "index.html"))
})

if (process.env.VERCEL !== "1") {
  app.listen(port, () => console.log(`Sarum Cut backend listening at http://localhost:${port}`))
}

export default app
