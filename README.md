# MRKD Presentation Room

The 34-slide MRKD vibecoding workshop, published at **<https://markdo27.github.io/presentation/>**, together with an optional self-hosted presentation room that puts the same deck behind server-side sign-in with viewer and admin roles. The slide source stays editable in `vibecoding-deck.html`.

> **The published deck is public.** GitHub Pages serves `vibecoding-deck.html` as the site index, so anyone with the link can read it. The sign-in described below gates the self-hosted app, not the Pages site.

## Start locally

Requires Node.js 24.14 or later. No third-party runtime packages are required.

```sh
npm start
```

Open http://127.0.0.1:8778/setup on the first run and create your admin username and password. Setup is available only from localhost in development, and closes permanently once the first account exists. There are no default credentials and no public registration.

After setup, use http://127.0.0.1:8778/login to sign in. `python serve.py` is a compatibility launcher for the same authenticated server. Do not use a generic static file server for this project.

## Access

- Viewers can open the presentation and change their password.
- Admins can also create viewer/admin accounts, revoke or restore access, and reset passwords.
- New accounts receive a temporary password supplied by the admin and must change it before opening the deck. Share credentials privately outside the app.
- Revocation and password resets invalidate all of that person's existing sessions. Admins cannot revoke their own account.
- Sign-in is required for both `/deck` and the original `/vibecoding-deck.html` URL. Only explicitly listed public UI assets are served; database, backups and source files are never exposed through a directory server.

## Data and sessions

SQLite stores accounts and sessions in `.data/presentation.sqlite`. Keep this directory private and back it up securely. It is excluded from Git and Docker build context, along with `.env` and build scratch files. Passwords use salted scrypt hashes; session identifiers are random, hashed in storage, and carried by HttpOnly SameSite=Strict cookies. Sessions expire after eight hours or one hour idle. The app enforces CSRF checks, rate limits, and server-side roles.

Authentication controls future access. A person who is allowed to view the presentation can still copy, save or capture what they see. Previously shared copies cannot be recalled.

## Hosting

GitHub Pages publishes the deck only: a static copy of `vibecoding-deck.html` served as the site index, with no accounts and no access control. That deployment is `.github/workflows/pages.yml`, and it is the whole of it.

The presentation room is a separate thing and is not what Pages runs. It requires a Node server with persistent storage and **cannot run on GitHub Pages or any static host**.

1. Create the first admin locally before exposing the service, or run the first-time setup through a local connection on the host before switching to production.
2. Use one Node process with a private, persistent `DATA_DIR` volume. Securely provision the initialized database on that volume, without committing it to Git.
3. Set `NODE_ENV=production`, `HOST=0.0.0.0`, and `APP_ORIGIN=https://your-exact-hostname`. The origin has no trailing slash. Set `PORT` if needed.
4. Put the app behind an HTTPS reverse proxy that preserves the configured Host header. Block direct public access to the upstream HTTP port. The app deliberately ignores forwarded IP/host headers; rate limits include the socket address and username.
5. Only route traffic to this application. Never separately serve the repository root as static files. Production setup is disabled, and the server refuses production startup without an HTTPS origin.

For container hosting, the included Dockerfile runs as the unprivileged `node` user. Mount a writable persistent volume at `/app/.data` (or set `DATA_DIR` to another volume). This repository does not contain a live deployment or real account credentials.

## Verify

```sh
npm run check
npm test
```

The integration tests use temporary databases and exercise direct-link protection, setup, CSRF, password hashing, role separation, temporary passwords, revocation, resets, logout, persistence, expiration and throttling.

## Deck

The Liquid Font specimens embed the original engine and glyph data from [Mark's Liquid Font project](https://markdo27.github.io/generativefont_creator/). Vinafont construction diagrams are explicitly labelled as schematic examples in the deck's typeface.
