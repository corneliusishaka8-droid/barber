# Sarum Cut Barber Studio

A React and Three.js website for a modern barber studio, with an Express backend. The visual direction is dark and editorial, with warm gold accents, fine borders, interactive 3D scenes, and responsive layouts.

## Project structure

```text
barbers/
├── backend/
│   ├── routes/api.js             # Express API routes
│   ├── server.js                 # API server and production static hosting
│   ├── package.json
│   └── package-lock.json
└── frontend/
    ├── package.json              # Convenience scripts for the Vite app
    └── barbars/
        ├── public/
        │   ├── images/hairstyles/ # Local hairstyle preview artwork
        │   └── textures/         # Earth globe textures
        ├── src/
        │   ├── components/about/
        │   ├── components/contact/
        │   ├── data/              # Hairstyle and service catalogues
        │   ├── pages/
        │   ├── App.jsx            # React Router and home page
        │   └── main.jsx
        ├── package.json
        └── vite.config.js
```

There is no single root `package.json`; install and run dependencies from the relevant app directory.

## Frontend

The Vite app is in `frontend/barbars`. It uses React, React Router, Three.js with React Three Fiber and Drei, GSAP, and Lenis.

### Pages and routes

| Route | Current page |
| --- | --- |
| `/` | Cinematic home page with an interactive 3D barber chair, service menu, style showcase, gallery, and booking call to action. |
| `/services` | Interactive hairstyle studio with category filters, local hairstyle artwork, descriptions, static NGN/USD prices and durations, service catalogue, studio/home-service options, benefits, and contact links. |
| `/about` | Brand story and craft page with interactive 3D clipper, tool display, chair scene, and editorial story sections. |
| `/contact` | Contact form, contact channels, Lagos information, and an interactive 3D clipper. Service and style links can prefill the contact form. |
| `/login` | Styled login interface with username/password fields and a Google sign-in button. Authentication is not connected; actions show an unavailable message. |
| `/register` | Intentionally blank placeholder route. |
| `/booking` | Intentionally blank placeholder route. |
| `/work` | Intentionally blank placeholder route. |

The home, Services, Contact, and About headers link to `/login`. The Home page also has a matching mobile menu.

### Editable content

- `frontend/barbars/src/data/hairstyles.js` contains the style names, categories, descriptions, image paths, NGN and USD prices, and session durations. The UI derives its category filters from this data.
- `frontend/barbars/src/data/services.js` contains the service catalogue, studio/home-service availability, home-service steps, benefits, and configurable travel-fee fields. Home-service fees are currently unset and are not added to style prices.
- `frontend/barbars/src/components/contact/contactConfig.js` contains the email and social/contact URLs. They are currently blank. Set these values to enable configured contact links and email copy.

The Contact form prepares an email using `mailto:` when an email address is configured. Until then, it displays a setup message. The login and Google buttons are visual UI only; there is no authentication provider or account system yet.

### Run the frontend

```bash
cd frontend/barbars
npm install
npm run dev
```

Vite prints the local development URL, usually `http://localhost:5173`.

Available frontend commands:

```bash
npm run build    # Production build to frontend/barbars/dist
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

The convenience scripts in `frontend/package.json` delegate to the nested Vite app. Install frontend dependencies in `frontend/barbars` first.

## Backend

The backend uses Express 5 and CORS. `backend/server.js` serves the built frontend from `frontend/barbars/dist`, exposes JSON parsing and CORS middleware, mounts the API router at `/api`, and sends the frontend entry point for other routes so React Router pages can load directly.

Current API endpoint:

| Method | Path | Response |
| --- | --- | --- |
| `GET` | `/api/message` | `{ "message": "hello world" }` |

There is no database, persistent storage, appointment service, or authentication API configured yet.

### Run the backend

```bash
cd backend
npm install
node server.js
```

The server listens on port `3000`. Visit `http://localhost:3000/api/message` to check the sample API route. To serve the frontend through Express, build it first with `npm run build` from `frontend/barbars`; then start the backend.

For separate development servers, run Vite and Express in two terminals. The frontend currently does not configure a Vite API proxy, so call the backend at port `3000` directly when adding API integration.

## Loading and visual details

The home page uses skeleton loading states for its initial layout, photo/video loading, and 3D scenes. Hairstyle images and deferred 3D scenes also use skeleton placeholders. A slim dark scrollbar with a muted gold hover state is styled globally. Home-page photography and the main site fonts load from external services; hairstyle preview artwork is stored locally as SVG files.
