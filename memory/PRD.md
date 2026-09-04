# Harswaggitify PRD

## Original problem statement
Build a Spotify-inspired black and pink webpage for Harshita that asks her mood, generates playlists from Spotify references, and creates them directly in Spotify after authorization. Include pop, R&B, rap, 80s and 90s references, romantic loading messages, smooth animations, and an affectionate visual experience. Site name: Harswaggitify.

## Architecture decisions
- React frontend with FastAPI backend and the existing MongoDB connection.
- Spotify OAuth and playlist operations stay server-side; the browser stores only the returned access token for the current experience.
- Spotify API credentials are intentionally not added because the user does not yet have them.

## User personas
- Harshita: chooses a mood and receives a personal playlist.
- Partner: creates a thoughtful music surprise for Harshita.

## Core requirements
- Connect with Spotify before using playlist creation.
- Mood buttons, free-text context, and surprise-me flow.
- Preview tracks before creating a private playlist.
- Romantic black, hot-pink, blush, editorial UI with responsive layout.

## Implemented — 2026-02-14
- Built branded auth-first welcome experience with generated vinyl artwork.
- Added Spotify status, login, callback, profile, search, and playlist creation endpoints.
- Added mood selection, free-text feeling, surprise mode, preview, confirmation, and Spotify link states.
- Added setup guidance modal when Spotify credentials are missing.

## Prioritized backlog
- P0: Add Spotify Client ID, Client Secret, and registered callback URL to backend environment.
- P1: Add persistent playlist history and recent creations.
- P1: Add richer mood-to-query interpretation and artist weighting.
- P2: Add Spotify player preview for authorized Premium users.

## Next tasks
- Configure Spotify Developer app and verify OAuth callback end-to-end.
- Replace fallback preview tracks with live Spotify search results.
- Add saved “love notes” attached to each generated playlist.