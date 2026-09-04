const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || `${window.location.origin}/`;
const SCOPES = "playlist-modify-private";
const KEYS = { token: "harswaggitify_access_token", expires: "harswaggitify_token_expires", verifier: "harswaggitify_code_verifier", pending: "harswaggitify_pending_playlist" };

const base64Url = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export const searchUrl = (query) => `https://open.spotify.com/search/${encodeURIComponent(query)}`;

export const getStoredToken = () => {
  const token = localStorage.getItem(KEYS.token);
  const expires = Number(localStorage.getItem(KEYS.expires) || 0);
  if (!token || (expires && Date.now() > expires)) return null;
  return token;
};

export const clearToken = () => { localStorage.removeItem(KEYS.token); localStorage.removeItem(KEYS.expires); };

const storeToken = (data) => {
  localStorage.setItem(KEYS.token, data.access_token);
  localStorage.setItem(KEYS.expires, String(Date.now() + (data.expires_in || 3600) * 1000 - 60000));
};

export const savePending = (pending) => localStorage.setItem(KEYS.pending, JSON.stringify(pending));
export const takePending = () => { const raw = localStorage.getItem(KEYS.pending); localStorage.removeItem(KEYS.pending); return raw ? JSON.parse(raw) : null; };

export async function beginAuth(pending) {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  const verifier = base64Url(bytes);
  const challenge = base64Url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  localStorage.setItem(KEYS.verifier, verifier);
  savePending(pending);
  const params = new URLSearchParams({ client_id: CLIENT_ID, response_type: "code", redirect_uri: REDIRECT_URI, code_challenge_method: "S256", code_challenge: challenge, scope: SCOPES });
  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function finishAuth(code) {
  const verifier = localStorage.getItem(KEYS.verifier);
  if (!verifier) return null;
  const response = await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: CLIENT_ID, grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI, code_verifier: verifier }) });
  const data = await response.json();
  if (!data.access_token) throw new Error("Spotify authorization failed");
  localStorage.removeItem(KEYS.verifier);
  storeToken(data);
  return data.access_token;
}

const api = async (token, path, options = {}) => {
  const response = await fetch(`https://api.spotify.com/v1${path}`, { ...options, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...options.headers } });
  if (response.status === 401) { clearToken(); throw new Error("expired"); }
  if (!response.ok) throw new Error(`Spotify ${response.status}`);
  return response.status === 204 ? null : response.json();
};

export async function matchTracks(token, tracks) {
  return Promise.all(tracks.map(async (track) => {
    const data = await api(token, `/search?${new URLSearchParams({ q: track.query, type: "track", limit: "1" })}`);
    const item = data.tracks?.items?.[0];
    return item ? { uri: item.uri, image: item.album?.images?.[1]?.url || item.album?.images?.[0]?.url || null, url: item.external_urls?.spotify || null } : null;
  }));
}

export async function createSpotifyPlaylist(token, { name, description, uris }) {
  const profile = await api(token, "/me");
  const playlist = await api(token, `/users/${profile.id}/playlists`, { method: "POST", body: JSON.stringify({ name, description, public: false }) });
  await api(token, `/playlists/${playlist.id}/tracks`, { method: "POST", body: JSON.stringify({ uris }) });
  return playlist;
}
