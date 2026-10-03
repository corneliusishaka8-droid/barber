# Sarum Cut Barber Studio

A full-stack barber studio website and member portal built with React, Vite, Express, Passport, and PostgreSQL. The frontend is built and served by the Express server in production, so the application can be deployed as a single web service.

## Project structure

```text
barbers/
├── backend/
│   ├── routes/api.js             # Authentication, contact and session API
│   ├── schema.sql                # PostgreSQL user and session tables
│   ├── server.js                 # Express API and production static hosting
│   ├── db.js                     # PostgreSQL connection pool
│   ├── passport.js               # Local and optional Google OAuth strategies
│   └── package.json
├── frontend/
│   ├── package.json              # Convenience scripts
│   └── barbars/
│       ├── src/
│       │   ├── auth/
│       │   ├── components/
│       │   ├── data/
│       │   └── pages/
│       ├── package.json
│       └── vite.config.js
├── .github/workflows/ci.yml      # GitHub lint, build and syntax checks
├── render.yaml                  # Render Blueprint web service
└── .node-version                # Node.js version used for deployment
```

## Features

- Responsive dark-and-gold barber studio site with interactive 3D scenes.
- Service and hairstyle catalogues with local artwork and pricing.
- Contact and booking inquiry forms.
- Username/password registration and login, with optional Google OAuth.
- Protected member profile and booking pages.
- PostgreSQL-backed user records and persistent login sessions.

## Routes

### Frontend

| Path | Page |
| --- | --- |
| `/` | Home |
| `/services` | Services and style catalogue |
| `/about` | Studio story |
| `/contact` | Contact and inquiries |
| `/login` | Member login |
| `/register` | Member registration |
| `/booking`, `/book-now` | Protected booking pages |
| `/profile` | Protected member profile |
| `/privacy`, `/terms` | Legal information |

### API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/register` | Create an account |
| `POST` | `/api/login` | Start a member session |
| `GET` | `/api/session` | Get the current session |
| `POST` | `/api/logout` | End the current session |
| `GET` | `/api/auth/google` | Start optional Google sign-in |
| `GET` | `/api/auth/google/callback` | Complete Google sign-in |
| `POST` | `/api/contact` | Receive a contact or booking inquiry |
| `GET` | `/api/message` | Basic health-check endpoint |

The booking inquiry endpoint currently receives submissions but does not create persistent appointments or process payments.

## Local development

### 1. Configure the backend

```powershell
Copy-Item backend/.env.example backend/.env
```

Set the PostgreSQL connection values in `backend/.env`. The backend accepts either the individual `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, and `DB_PORT` settings or a `DATABASE_URL`. Create the database and run `backend/schema.sql` against it before using registration or login.

Google sign-in is optional. To enable it locally, configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` in the backend environment and register the callback URL with Google.

### 2. Start the frontend

```powershell
cd frontend/barbars
npm ci
npm run dev
```

Vite normally runs at `http://localhost:5173`; its `/api` requests are proxied to the backend on port `3000`.

### 3. Start the backend in another terminal

```powershell
cd backend
npm ci
npm start
```

The backend listens on `http://localhost:3000`.

Frontend commands (run from `frontend/barbars`):

```text
npm run dev
npm run lint
npm run build
npm run preview
```

## Deploy with GitHub and Render

The repository includes a Render Blueprint (`render.yaml`) and GitHub Actions checks. Render builds the Vite frontend, installs the backend, and starts Express to serve both the API and built site. Pushing to the connected GitHub branch triggers a deployment.

1. Review and commit the deployment changes, then push the connected branch to GitHub:

   ```powershell
   git add -A
   git commit -m "Prepare project for deployment"
   git push origin main
   ```

   The local `backend/.env` and installed `backend/node_modules` remain on your computer but are no longer tracked. Do not commit `.env` files, passwords, OAuth secrets, or database credentials; the example files contain placeholders only. If real credentials were ever pushed, rotate them because untracking a file does not remove it from earlier Git history.
2. Provision a PostgreSQL database with Render or another provider. Apply `backend/schema.sql` to that database before relying on registration and login.
3. In Render, choose **New > Blueprint**, connect the GitHub repository, and apply the `render.yaml` configuration.
4. Set the service's `DATABASE_URL` to the database connection string. The Blueprint generates `SESSION_SECRET`; set `FRONTEND_ORIGIN` to the deployed service URL, such as `https://your-service.onrender.com`.
5. If enabling Google sign-in, add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` in the Render service environment. Set the callback to `https://your-service.onrender.com/api/auth/google/callback` and register that exact URL with Google.
6. Deploy. The service health check uses `/api/message`; after it passes, open the Render service URL to verify the site.

The Blueprint uses Render's free web-service plan. The database is intentionally configured separately so you can select a database provider and plan that suits your needs. Set `DATABASE_SSL=true` when the database provider requires TLS; the Render Blueprint enables it by default.

GitHub Actions runs frontend lint/build checks and backend syntax checks for pushes and pull requests. Render deployment is configured separately by connecting the repository through Render's Blueprint flow.

## Content configuration

- `frontend/barbars/src/data/hairstyles.js` and `services.js` hold the service and style catalogues.
- `frontend/barbars/src/components/contact/contactConfig.js` holds contact links and email settings.
- `backend/schema.sql` defines the account and session tables.
