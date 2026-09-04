from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from datetime import datetime, timezone
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")
client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]
app = FastAPI(title="Harswaggitify API")
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Harswaggitify is ready", "spotify_mode": "client_pkce"}

@api_router.get("/spotify/status")
async def spotify_status():
    return {"mode": "client_pkce", "client_secret_required": False, "playlist_scope": "playlist-modify-private"}

@api_router.post("/playlist-events")
async def record_playlist_event(payload: dict):
    await db.playlist_events.insert_one({"playlist_id": payload.get("playlist_id"), "name": payload.get("name"), "created_at": datetime.now(timezone.utc).isoformat()})
    return {"saved": True}

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","), allow_methods=["*"], allow_headers=["*"])

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()