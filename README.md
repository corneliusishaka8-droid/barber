# Sarum Cut Barber Studio

Sarum Cut Barber Studio is a full-stack barber booking and membership platform built with React, Vite, Express, PostgreSQL, and Passport. The project combines a premium salon landing page with authenticated member flows for login, registration, profile access, and contact or booking inquiries.

## Overview

This project is designed to showcase a modern barber brand while also giving the studio a working member portal. It includes:

- A polished storefront and service catalogue
- Booking and contact inquiry forms
- Local username/password authentication with bcrypt hashing
- Optional Google OAuth sign-in
- PostgreSQL-backed user records and session storage
- A production-ready Express server that serves the built frontend

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Authentication: Passport.js with local strategy and Google OAuth 2.0
- Database: PostgreSQL
- Session storage: PostgreSQL-backed sessions via `connect-pg-simple`
- Environment management: dotenv
- Deployment target: Render or any Node host that can serve static files and run Express

## Project structure

```text
barbers/
├── backend/
│   ├── db.js
│   ├── passport.js
│   ├── schema.sql
│   ├── server.js
│   ├── routes/
│   │   └── api.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── package.json
│   └── barbers/
│       ├── src/
│       ├── public/
│       ├── index.html
│       ├── vite.config.js
│       ├── eslint.config.js
│       └── package.json
├── .gitignore
├── README.md
├── .env.example (if present in repo root)
└── package-lock.json (root if installed)
```

## Features

- Responsive dark-and-gold visual design for a barber studio brand
- Service and hairstyle catalogues with styled content blocks
- Contact form and booking inquiry support
- Secure local sign-up and sign-in flow
- Optional Google account linking for user sign-in
- Protected routes for profile and booking experiences
- Session-aware API that returns the current authenticated user
- Production static serving for the built frontend from the backend server

## Authentication and user flow

The backend exposes a session-based authentication system built with Passport.

### Local auth

- `POST /api/register` creates a user account
- `POST /api/login` authenticates and creates a session
- `GET /api/session` returns the logged-in user if authenticated
- `POST /api/logout` ends the current session

### Google OAuth

When configured, the app supports Google sign-in through:

- `GET /api/auth/google`
- `GET /api/auth/google/callback`

Google OAuth is enabled only when the required environment variables are present.

## Environment variables

Create a local environment file in `backend/.env` by copying the example template if one exists.

### Required for the app to run

```env
PORT=3000
SESSION_SECRET=your_session_secret_here
```

### Database configuration

Use either a connection string or individual values:

```env
DATABASE_URL=postgres://user:password@host:5432/dbname
# or
DB_USER=postgres
DB_HOST=localhost
DB_NAME=barber_db
DB_PASSWORD=your_password
DB_PORT=5432
DATABASE_SSL=false
```

### Optional Google OAuth

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
FRONTEND_ORIGIN=http://localhost:5173
```

### Production note

Keep `.env` files out of Git. The repository is configured to ignore them in `.gitignore`, and only example templates should be tracked.

## Local development

### 1. Install dependencies

Open two terminals.

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend/barbers
npm install
```

### 2. Set up PostgreSQL

Create a PostgreSQL database and run the schema file:

```bash
psql -U postgres -d barber_db -f backend/schema.sql
```

If you are using a local database, make sure the connection details in `backend/.env` match your PostgreSQL configuration.

### 3. Start the frontend

```bash
cd frontend/barbers
npm run dev
```

The Vite app usually runs on:

```text
http://localhost:5173
```

### 4. Start the backend

```bash
cd backend
npm start
```

The backend usually runs on:

```text
http://localhost:3000
```

## Common project scripts

### Backend

```bash
cd backend
npm start
```

### Frontend


Run from `frontend/barbers`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## API endpoints

### Public routes

```text
GET  /api/message
POST /api/contact
POST /api/register
POST /api/login
POST /api/logout
GET  /api/session
```

### Google auth routes

```text
GET /api/auth/google
GET /api/auth/google/callback
```

### Notes

- Contact submissions are logged in the backend and return a success response.
- Booking requests are protected when the user is authenticated.
- The current implementation focuses on booking/contact inquiry handling rather than payment processing.

## Deployment

The frontend can be deployed separately from the Express API. Production frontend builds use
`https://backend-eight-orcin-13.vercel.app/api` by default; set `VITE_API_BASE_URL` if the API
is hosted elsewhere. Local frontend development continues to use Vite's `/api` proxy.

Configure these backend environment variables in the hosting provider:

- `DATABASE_URL` or the `DB_*` database settings
- `SESSION_SECRET` with a long, randomly generated value
- `FRONTEND_ORIGIN` set to the deployed frontend's exact origin (scheme and host, no path)
- `SESSION_COOKIE_SAME_SITE=none` when frontend and API use different sites
- Optional Google OAuth variables, with the deployed callback URL

Keep `.env` files and all real credentials out of Git. Set production values in the hosting
provider's environment-variable settings, not in the frontend bundle.

## Security notes

- Never commit `.env` files or any real secrets
- Keep OAuth client IDs and secrets in environment variables only
- Rotate credentials immediately if a secret was ever exposed in Git history
- Use example files such as `.env.example` for safe placeholders

## License

This project is currently structured for local development and deployment without a formal public license file in the repo. If you plan to distribute it publicly, add an appropriate license before publishing.

## Contributing

1. Fork or clone the project
2. Create a feature branch
3. Make changes with tests or validation when available
4. Keep environment files local and untracked
5. Submit a pull request with a clear summary of the change
