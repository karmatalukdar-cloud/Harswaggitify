# Harswaggitify PRD

## Original problem statement
Build a Spotify-inspired black and pink webpage for Harshita that asks her mood, generates playlists from Spotify references, and creates them directly in Spotify after authorization. Include pop, R&B, rap, 80s and 90s references, romantic loading messages, smooth animations, and an affectionate visual experience. Site name: Harswaggitify.

## Architecture decisions
- React frontend with FastAPI backend and the existing MongoDB connection.
- No Spotify OAuth or developer credentials are required.
- The browser opens official Spotify search pages for each recommended song or mood query.

## User personas
- Harshita: chooses a mood and receives a personal playlist.
- Partner: creates a thoughtful music surprise for Harshita.

## Core requirements
- No sign-in or developer setup required.
- Mood buttons, free-text context, and surprise-me flow.
- Preview songs with one-tap Spotify search links.
- Romantic black, hot-pink, blush, editorial UI with responsive layout.

## Implemented — 2026-02-14
- Built branded auth-first welcome experience with generated vinyl artwork.
- Added mood selection, free-text feeling, surprise mode, track preview, and direct Spotify search links.
- Removed the user-facing developer setup and authorization gate.

## Prioritized backlog
- P0: Keep the no-setup Spotify search flow stable.
- P1: Add persistent playlist history and recent creations.
- P1: Add richer mood-to-query interpretation and artist weighting.
- P2: Add Spotify player preview for authorized Premium users.

## Next tasks
- Expand the curated song library by mood and era.
- Add saved “love notes” attached to each generated playlist.