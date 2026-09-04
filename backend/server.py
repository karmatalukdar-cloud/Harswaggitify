from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from pathlib import Path
from urllib.parse import urlencode
from datetime import datetime, timezone
import os
import logging
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Harswaggitify API")
api_router = APIRouter(prefix="/api")
SPOTIFY_AUTH = "https://accounts.spotify.com"
SPOTIFY_API = "https://api.spotify.com/v1"
SCOPES = "user-read-private playlist-modify-public playlist-modify-private"

class MoodRequest(BaseModel):
    mood: str
    feeling: str = ""

class PlaylistRequest(BaseModel):
    access_token: str
    name: str
    description: str
    track_uris: list[str]

def spotify_configured():
    return bool(os.getenv("SPOTIFY_CLIENT_ID") and os.getenv("SPOTIFY_CLIENT_SECRET") and os.getenv("SPOTIFY_REDIRECT_URI"))

def spotify_headers(token: str):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

@api_router.get("/")
async def root():
    return {"message": "Harswaggitify is ready"}

@api_router.get("/spotify/status")
async def spotify_status():
    return {"configured": spotify_configured(), "scopes": SCOPES.split()}

@api_router.get("/spotify/login")
async def spotify_login():
    if not spotify_configured():
        raise HTTPException(status_code=503, detail="Spotify credentials are not configured yet.")
    params = {"client_id": os.environ["SPOTIFY_CLIENT_ID"], "response_type": "code", "redirect_uri": os.environ["SPOTIFY_REDIRECT_URI"], "scope": SCOPES}
    return {"auth_url": f"{SPOTIFY_AUTH}/authorize?{urlencode(params)}"}

@api_router.get("/spotify/callback")
async def spotify_callback(code: str = Query(...)):
    if not spotify_configured():
        raise HTTPException(status_code=503, detail="Spotify credentials are not configured yet.")
    response = requests.post(f"{SPOTIFY_AUTH}/api/token", data={"grant_type": "authorization_code", "code": code, "redirect_uri": os.environ["SPOTIFY_REDIRECT_URI"], "client_id": os.environ["SPOTIFY_CLIENT_ID"], "client_secret": os.environ["SPOTIFY_CLIENT_SECRET"]}, timeout=20)
    if response.status_code >= 400:
        raise HTTPException(status_code=400, detail="Spotify authorization could not be completed.")
    return response.json()

@api_router.get("/spotify/profile")
async def spotify_profile(access_token: str):
    response = requests.get(f"{SPOTIFY_API}/me", headers=spotify_headers(access_token), timeout=20)
    if response.status_code >= 400:
        raise HTTPException(status_code=401, detail="Spotify session expired. Please reconnect.")
    profile = response.json()
    return {"id": profile.get("id"), "display_name": profile.get("display_name"), "image": (profile.get("images") or [{}])[0].get("url")}

@api_router.post("/spotify/search")
async def spotify_search(request: MoodRequest, access_token: str):
    query = request.feeling.strip() or request.mood
    response = requests.get(f"{SPOTIFY_API}/search", params={"q": query, "type": "track", "limit": 20}, headers=spotify_headers(access_token), timeout=20)
    if response.status_code >= 400:
        raise HTTPException(status_code=400, detail="Spotify could not find those tracks.")
    return response.json().get("tracks", {}).get("items", [])

@api_router.post("/spotify/create-playlist")
async def create_playlist(request: PlaylistRequest):
    headers = spotify_headers(request.access_token)
    me = requests.get(f"{SPOTIFY_API}/me", headers=headers, timeout=20)
    if me.status_code >= 400:
        raise HTTPException(status_code=401, detail="Spotify session expired. Please reconnect.")
    user_id = me.json()["id"]
    created = requests.post(f"{SPOTIFY_API}/users/{user_id}/playlists", headers=headers, json={"name": request.name, "description": request.description, "public": False}, timeout=20)
    if created.status_code >= 400:
        raise HTTPException(status_code=400, detail="Spotify could not create the playlist.")
    playlist = created.json()
    added = requests.post(f"{SPOTIFY_API}/playlists/{playlist['id']}/items", headers=headers, json={"uris": request.track_uris}, timeout=20)
    if added.status_code >= 400:
        raise HTTPException(status_code=400, detail="Playlist was created, but tracks could not be added.")
    await db.playlist_events.insert_one({"playlist_id": playlist["id"], "name": request.name, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"url": playlist.get("external_urls", {}).get("spotify"), "name": playlist["name"]}

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","), allow_methods=["*"], allow_headers=["*"])
logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()