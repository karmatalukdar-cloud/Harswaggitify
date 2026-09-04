import { useMemo, useState } from "react";
import { ArrowUpRight, Heart, Music2, Sparkles, WandSparkles, Check } from "lucide-react";
import "@/App.css";
import "@/AppOverrides.css";

const moods = [
  { id: "soft", label: "Soft & floaty", note: "for the days that feel like satin", query: "Daniel Caesar The 1975 soft R&B" },
  { id: "main-character", label: "Main character", note: "a little drama, a lot of sparkle", query: "Drake Travis Scott A$AP Rocky main character" },
  { id: "healing", label: "Healing era", note: "slow songs for a tender heart", query: "Daniel Caesar SZA healing R&B" },
  { id: "late-night", label: "After midnight", note: "city lights and honest feelings", query: "The 1975 Kanye West late night" },
  { id: "unbothered", label: "Unbothered", note: "pretty, powerful, completely yours", query: "A$AP Rocky Rihanna confident" },
];
const tracks = [
  { name: "Best Part", artist: "Daniel Caesar · H.E.R.", album: "Freudian", query: "Best Part Daniel Caesar H.E.R." },
  { name: "Love It If We Made It", artist: "The 1975", album: "A Brief Inquiry into Online Relationships", query: "Love It If We Made It The 1975" },
  { name: "SKELETONS", artist: "Travis Scott", album: "ASTROWORLD", query: "SKELETONS Travis Scott" },
  { name: "Passionfruit", artist: "Drake", album: "More Life", query: "Passionfruit Drake" },
  { name: "L$D", artist: "A$AP Rocky", album: "AT.LONG.LAST.A$AP", query: "L$D A$AP Rocky" },
];

function spotifySearch(query) { return `https://open.spotify.com/search/${encodeURIComponent(query)}`; }

export default function App() {
  const [mood, setMood] = useState("soft");
  const [feeling, setFeeling] = useState("");
  const [generated, setGenerated] = useState(false);
  const selectedMood = useMemo(() => moods.find((item) => item.id === mood), [mood]);
  const surprise = () => { setMood(moods[Math.floor(Math.random() * moods.length)].id); setFeeling("surprise me with something beautiful"); };
  const makePlaylist = () => setGenerated(true);
  return <main className="app-shell"><header className="topbar"><div className="brand"><span className="brand-mark"><Heart size={16} fill="currentColor" /></span><span>Harswaggitify</span></div><span className="profile-chip" data-testid="profile-chip"><Heart size={14} fill="currentColor" /> made for Harshita</span></header><section className="app-content"><div className="greeting"><p className="eyebrow">A playlist, made in your language <Sparkles size={14} /></p><h1>How is your heart<br /><em>singing</em> today?</h1><p>Choose a feeling. Add a little context. I’ll find the songs that get it.</p></div><div className="mood-grid">{moods.map((item) => <button data-testid={`mood-${item.id}-button`} key={item.id} className={`mood-button ${mood === item.id ? "selected" : ""}`} onClick={() => { setMood(item.id); setGenerated(false); }}><span>{item.label}</span><small>{item.note}</small>{mood === item.id && <Check size={17} />}</button>)}</div><div className="feeling-row"><label htmlFor="feeling">Add a little more, if you want to</label><textarea data-testid="feeling-input" id="feeling" value={feeling} onChange={(event) => { setFeeling(event.target.value); setGenerated(false); }} placeholder="e.g. I want to feel like the city belongs to me..." /><button data-testid="surprise-me-button" className="surprise-button" onClick={surprise}><WandSparkles size={17} /> Surprise me</button></div><div className="action-row"><div><span className="selected-label">Selected feeling</span><strong>{selectedMood.label}</strong></div><button data-testid="make-playlist-button" className="primary-button" onClick={makePlaylist}>Make my playlist <ArrowUpRight size={17} /></button></div>{generated && <PlaylistPreview query={feeling || selectedMood.query} />}</section></main>;
}

function PlaylistPreview({ query }) { return <section className="playlist-preview"><div className="preview-heading"><div><p className="eyebrow">Your little soundtrack <Music2 size={14} /></p><h2>Made for Harshita</h2></div><span className="track-count">5 songs</span></div><p className="preview-note">Tap any song to open it instantly in Spotify. No account setup here — just music.</p><div className="track-list">{tracks.map((track, index) => <a data-testid={`spotify-search-${index + 1}-link`} className="track" key={track.name} href={spotifySearch(track.query || query)} target="_blank" rel="noreferrer"><span className="track-number">0{index + 1}</span><span className="cover-art"><Music2 size={18} /></span><span><strong>{track.name}</strong><small>{track.artist}</small></span><span className="album-name">{track.album}</span><ArrowUpRight size={15} className="track-arrow" /></a>)}</div><a data-testid="spotify-search-playlist-link" className="confirm-button" href={spotifySearch(query)} target="_blank" rel="noreferrer">Open this feeling on Spotify <ArrowUpRight size={17} /></a></section>; }