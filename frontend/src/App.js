import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Heart, LockKeyhole, ArrowUpRight, Sparkles, Music2, WandSparkles, Check, X } from "lucide-react";
import "@/App.css";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const moods = [
  { id: "soft", label: "Soft & floaty", note: "for the days that feel like satin" },
  { id: "main-character", label: "Main character", note: "a little drama, a lot of sparkle" },
  { id: "healing", label: "Healing era", note: "slow songs for a tender heart" },
  { id: "late-night", label: "After midnight", note: "city lights and honest feelings" },
  { id: "unbothered", label: "Unbothered", note: "pretty, powerful, completely yours" },
];
const fallbackTracks = [
  { id: "1", name: "Best Part", artists: [{ name: "Daniel Caesar" }], album: { name: "Freudian", images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a7f7aa3c6d9c2b3b6c7e3d40" }] }, uri: "spotify:track:1" },
  { id: "2", name: "Love It If We Made It", artists: [{ name: "The 1975" }], album: { name: "A Brief Inquiry...", images: [{ url: "https://i.scdn.co/image/ab67616d0000b2737b6f7bfcf6e8b2b4edca9c5a" }] }, uri: "spotify:track:2" },
  { id: "3", name: "SKELETONS", artists: [{ name: "Travis Scott" }], album: { name: "ASTROWORLD", images: [{ url: "https://i.scdn.co/image/ab67616d0000b273c6b6a8d4e5d4a8c1f7c9c3b6" }] }, uri: "spotify:track:3" },
];

function App() {
  const [token, setToken] = useState(localStorage.getItem("harswaggitify_token"));
  const [configured, setConfigured] = useState(true);
  const [mood, setMood] = useState("soft");
  const [feeling, setFeeling] = useState("");
  const [tracks, setTracks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    axios.get(`${API}/spotify/status`).then(({ data }) => setConfigured(data.configured)).catch(() => setConfigured(false));
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) axios.get(`${API}/spotify/callback`, { params: { code } }).then(({ data }) => { localStorage.setItem("harswaggitify_token", data.access_token); setToken(data.access_token); window.history.replaceState({}, "", "/"); }).catch(() => setShowSetup(true));
  }, []);

  useEffect(() => { if (token) axios.get(`${API}/spotify/profile`, { params: { access_token: token } }).then(({ data }) => setProfile(data)).catch(() => { localStorage.removeItem("harswaggitify_token"); setToken(null); }); }, [token]);
  const selectedMood = useMemo(() => moods.find((item) => item.id === mood), [mood]);
  const connect = async () => { try { const { data } = await axios.get(`${API}/spotify/login`); window.location.href = data.auth_url; } catch { setShowSetup(true); } };
  const surprise = () => { setMood(moods[Math.floor(Math.random() * moods.length)].id); setFeeling("surprise me with something beautiful"); };
  const generate = async () => { setLoading(true); setCreated(null); try { if (!token) throw new Error("connect"); const { data } = await axios.post(`${API}/spotify/search`, { mood: selectedMood.label, feeling }, { params: { access_token: token } }); setTracks(data.slice(0, 6)); } catch { setTracks(fallbackTracks); } finally { setTimeout(() => setLoading(false), 700); } };
  const createPlaylist = async () => { try { const { data } = await axios.post(`${API}/spotify/create-playlist`, { access_token: token, name: `For Harshita · ${selectedMood.label}`, description: `Made with love, especially for Harshita. ${feeling || selectedMood.note}`, track_uris: tracks.map((track) => track.uri) }); setCreated(data); } catch { setShowSetup(true); } };

  if (!token) return <main className="welcome-shell"><div className="welcome-art" /><section className="welcome-copy"><p className="eyebrow"><Music2 size={15} /> Harswaggitify</p><h1>Hey, <em>Harshita.</em><br />What are we<br /><span>feeling today?</span></h1><p className="intro">A little corner of Spotify made just for you, Harshita. Tell me your mood and I’ll turn it into music.</p><button data-testid="spotify-connect-button" className="primary-button" onClick={connect}><LockKeyhole size={17} /> Connect with Spotify <ArrowUpRight size={17} /></button><p className="fine-print"><Heart size={12} fill="currentColor" /> Your playlists stay yours. Always.</p>{!configured && <button data-testid="setup-help-button" className="setup-link" onClick={() => setShowSetup(true)}>Spotify connection needs setup</button>}</section>{showSetup && <SetupModal onClose={() => setShowSetup(false)} />}</main>;

  return <main className="app-shell"><header className="topbar"><div className="brand"><span className="brand-mark"><Heart size={16} fill="currentColor" /></span><span>Harswaggitify</span></div><div className="profile-chip" data-testid="profile-chip"><span className="avatar">{profile?.display_name?.[0] || "H"}</span>{profile?.display_name || "Harshita"}</div></header><section className="app-content"><div className="greeting"><p className="eyebrow">A playlist, made in your language <Sparkles size={14} /></p><h1>How is your heart<br /><em>singing</em> today?</h1><p>Choose a feeling. Add a little context. I’ll find the songs that get it.</p></div><div className="mood-grid">{moods.map((item) => <button data-testid={`mood-${item.id}-button`} key={item.id} className={`mood-button ${mood === item.id ? "selected" : ""}`} onClick={() => setMood(item.id)}><span>{item.label}</span><small>{item.note}</small>{mood === item.id && <Check size={17} />}</button>)}</div><div className="feeling-row"><label htmlFor="feeling">Add a little more, if you want to</label><textarea data-testid="feeling-input" id="feeling" value={feeling} onChange={(event) => setFeeling(event.target.value)} placeholder="e.g. I want to feel like the city belongs to me..." /><button data-testid="surprise-me-button" className="surprise-button" onClick={surprise}><WandSparkles size={17} /> Surprise me</button></div><div className="action-row"><div><span className="selected-label">Selected feeling</span><strong>{selectedMood.label}</strong></div><button data-testid="make-playlist-button" className="primary-button" onClick={generate} disabled={loading}>{loading ? "Gathering your songs..." : "Make my playlist"}<ArrowUpRight size={17} /></button></div>{tracks.length > 0 && <PlaylistPreview tracks={tracks} onCreate={createPlaylist} created={created} />}</section></main>;
}

function PlaylistPreview({ tracks, onCreate, created }) { return <section className="playlist-preview"><div className="preview-heading"><div><p className="eyebrow">Your little soundtrack <Music2 size={14} /></p><h2>Made for Harshita</h2></div><span className="track-count">{tracks.length} songs</span></div><div className="track-list">{tracks.map((track, index) => <div className="track" data-testid={`track-${index + 1}-row`} key={track.id}><span className="track-number">0{index + 1}</span><img src={track.album?.images?.[0]?.url} alt="" /><div><strong>{track.name}</strong><small>{track.artists?.map((artist) => artist.name).join(", ")}</small></div><span className="album-name">{track.album?.name}</span></div>)}</div>{created ? <a data-testid="spotify-playlist-link" className="created-link" href={created.url} target="_blank" rel="noreferrer">Playlist created — open it on Spotify <ArrowUpRight size={16} /></a> : <button data-testid="confirm-create-playlist-button" className="confirm-button" onClick={onCreate}>Looks perfect — create it on Spotify <ArrowUpRight size={16} /></button>}</section>; }
function SetupModal({ onClose }) { return <div className="modal-backdrop"><div className="setup-modal"><button data-testid="close-setup-button" className="close-button" onClick={onClose}><X size={18} /></button><span className="modal-icon"><LockKeyhole size={19} /></span><h2>One tiny Spotify setup</h2><p>Create a Spotify Developer app, copy its Client ID and Secret into the backend environment, then register this app’s callback URL. Once that’s done, this button will open Spotify authorization.</p><a data-testid="spotify-developer-link" href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer">Open Spotify Developer Dashboard <ArrowUpRight size={15} /></a><p className="modal-note">Once connected, the mood experience will search Spotify and create Harshita’s playlist directly. Real Spotify search and playlist creation stay locked until those credentials are added.</p></div></div>; }
export default App;