# Harswaggitify PRD

## Original problem statement
Build a Spotify-inspired black and pink webpage for Harshita that asks her mood, generates playlists from Spotify references, and creates them directly in Spotify after authorization. Include pop, R&B, rap, 80s and 90s references, romantic loading messages, smooth animations, and an affectionate visual experience. Site name: Harswaggitify.

## Architecture decisions
- React frontend with FastAPI backend and the existing MongoDB connection.
- Spotify OAuth uses PKCE with a public Client ID only; no Client Secret is required.
- Confirmed playlists are created privately in the user’s Spotify account through the Spotify Web API.

## User personas
- Harshita: chooses a mood and receives a personal playlist.
- Partner: creates a thoughtful music surprise for Harshita.

## Core requirements
- Spotify authorization before the first playlist transfer.
- Mood buttons, free-text context, and surprise-me flow.
- Preview 20 songs, then create a private Spotify playlist and add the matched tracks automatically.
- Romantic black, hot-pink, blush, editorial UI with responsive layout.

## Implemented — 2026-02-14
- Built branded auth-first welcome experience with generated vinyl artwork.
- Added mood selection, free-text feeling, surprise mode, and 20-track preview.
- Added PKCE authorization and automatic private playlist creation with all matched tracks.

## Prioritized backlog
- P0: Verify Spotify PKCE callback and playlist creation with the registered Client ID.
- P1: Add persistent playlist history and recent creations.
- P1: Add richer mood-to-query interpretation and artist weighting.
- P2: Add Spotify player preview for authorized Premium users.

## Next tasks
- Expand the curated song library by mood and era.
- Add saved “love notes” attached to each generated playlist.