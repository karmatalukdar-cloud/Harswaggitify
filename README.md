# Harswaggitify

A Spotify-style mood playlist app made for Harshita. Pick a feeling, preview 20 hand-picked songs (pop, R&B, rap, 80s/90s hits) and create the playlist directly in your Spotify account with one click.

- **Frontend:** React (CRA + Craco), Tailwind, lucide-react
- **Backend:** FastAPI + MongoDB (minimal; Spotify auth runs entirely in the browser)
- **Auth:** Spotify OAuth **PKCE** flow — Client ID only, no client secret

## Project structure

```
frontend/   React app (UI, Spotify PKCE auth, playlist creation)
backend/    FastAPI server
```

## 1. Create a Spotify app

1. Go to https://developer.spotify.com/dashboard and click **Create app**.
2. Give it any name/description.
3. Under **Redirect URIs** add the URL where the app runs, ending with a slash, e.g. `http://localhost:3000/` (and your production URL when you deploy).
4. Tick **Web API** and save.
5. Copy the **Client ID**.

## 2. Run the frontend

```bash
cd frontend
cp .env.example .env        # then fill in REACT_APP_SPOTIFY_CLIENT_ID
yarn install
yarn start                  # http://localhost:3000
```

`REACT_APP_SPOTIFY_REDIRECT_URI` must match one of the redirect URIs registered in the Spotify dashboard exactly. If left empty, the app falls back to the current origin (`window.location.origin + "/"`).

## 3. Run the backend (optional)

```bash
cd backend
cp .env.example .env        # point MONGO_URL at your MongoDB
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

## Environment variables

| File | Variable | Description |
|------|----------|-------------|
| `frontend/.env` | `REACT_APP_SPOTIFY_CLIENT_ID` | Client ID from the Spotify developer dashboard |
| `frontend/.env` | `REACT_APP_SPOTIFY_REDIRECT_URI` | Redirect URI registered in Spotify (e.g. `http://localhost:3000/`) |
| `frontend/.env` | `REACT_APP_BACKEND_URL` | Base URL of the FastAPI server |
| `backend/.env` | `MONGO_URL` | MongoDB connection string |
| `backend/.env` | `DB_NAME` | MongoDB database name |
| `backend/.env` | `CORS_ORIGINS` | Comma-separated allowed origins (`*` for all) |

`.env` files are git-ignored. Use the `.env.example` files as templates.

## Production build

```bash
cd frontend && yarn build   # outputs to frontend/build
```

Made with love.
