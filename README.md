# psychic-umbrella

A bright, multi-surface UI for **Agent 13** — a control surface plus a conversation workspace that can switch between online reconnaissance and offline resilience, use symbolic overlays, vary information depth, and assemble persona-driven expert teams.

## Features
- **Bold, colorful UI:** gradient-backed layout with cards, chips, and pills for at-a-glance status.
- **Two-page experience:** Control Surface (index) plus Conversation Workspace with chat-style panels and sidebar navigation.
- **Online/offline modes:** toggle between live lookups and cached playbooks; service worker caches core assets for offline visits.
- **Symbolic overlay:** optional iconography to emphasize rigor, depth, and web intelligence signals in both panels.
- **Adjustable depth:** slider to move from summary-level answers to blueprint-grade detail across the workspace.
- **Persona studio:** choose how Agent 13 shows up (strategist, researcher, explainer, builder) and see persona cards update.
- **Expert council:** assemble a 30-year veteran roster tailored to your objective on both pages.
- **Chat memory:** workspace threads persist locally so conversations, modes, and overlays are remembered between visits.
- **Google sign-in:** quick “Continue with Google” control (with prompt-based fallback) to tag chats with your account.

## Setup
1. Install dependencies: `npm install`
2. Start a local static server for both pages: `npm start` (served at http://localhost:4173)
3. In the browser, load `index.html` or `workspace.html` from that server. Service worker caching will register automatically; to test offline mode, load the site once online, then toggle the connection switch or go offline in the browser.

## Testing
- Run lint plus smoke checks: `npm test`
- Run lint alone: `npm run lint`

## Deployment
The project is a static bundle. Any static host (Netlify, GitHub Pages, Vercel static export, Firebase Hosting, S3/CloudFront, etc.) can serve the contents of the repository. Ensure `service-worker.js` is served from the web root for offline caching and keep the `start`/`serve` script (HTTP server on port 4173) for local previews.
