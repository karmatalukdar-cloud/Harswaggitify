import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, Heart, Sparkles, WandSparkles } from "lucide-react";
import "@/App.css";
import "@/AppOverrides.css";
import { moods, tracklists, detectMood } from "@/data/moods";
import { PlaylistPreview } from "@/components/PlaylistPreview";
import { beginAuth, finishAuth, getStoredToken, matchTracks, createSpotifyPlaylist, takePending } from "@/lib/spotify";

const loveMessages = ["Finding the best versions of your 20 songs...", "Tuning every track to your heartbeat...", "Wrapping it up with a little love..."];

export default function App() {
  const [mood, setMood] = useState("soft");
  const [feeling, setFeeling] = useState("");
  const [note, setNote] = useState("");
  const [generated, setGenerated] = useState(false);
  const [token, setToken] = useState(getStoredToken());
  const [matches, setMatches] = useState(null);
  const [matching, setMatching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const selectedMood = useMemo(() => moods.find((item) => item.id === mood), [mood]);
  const tracks = tracklists[mood];

  const reset = () => { setGenerated(false); setMatches(null); setResult(null); setMessage(""); };

  const createPlaylist = async (activeToken, pending) => {
    setBusy(true); setResult(null);
    const ticker = setInterval(() => setMessage(loveMessages[Math.floor(Math.random() * loveMessages.length)]), 1400);
    setMessage(loveMessages[0]);
    try {
      const list = tracklists[pending.moodId];
      const found = (matches && pending.moodId === mood ? matches : await matchTracks(activeToken, list)).filter(Boolean);
      if (!found.length) throw new Error("No tracks found");
      const moodInfo = moods.find((item) => item.id === pending.moodId);
      const playlist = await createSpotifyPlaylist(activeToken, { name: `For Harshita · ${moodInfo.label}`, description: `${pending.note || `Made with love, especially for Harshita. ${pending.feeling || moodInfo.note}`}`.slice(0, 300), uris: found.map((item) => item.uri) });
      setResult({ name: playlist.name, url: playlist.external_urls?.spotify });
      setMessage(`${found.length} songs were added to “${playlist.name}”. Go listen, Harshita.`);
    } catch (error) {
      setToken(getStoredToken());
      setMessage(error.message === "expired" ? "Your Spotify session expired. Tap the button to reconnect." : "Spotify could not create the playlist. Please reconnect and try again.");
    } finally { clearInterval(ticker); setBusy(false); }
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    finishAuth(code).then((freshToken) => {
      window.history.replaceState({}, "", "/");
      if (!freshToken) return;
      setToken(freshToken);
      const pending = takePending();
      if (pending) { setMood(pending.moodId); setFeeling(pending.feeling || ""); setNote(pending.note || ""); setGenerated(true); createPlaylist(freshToken, pending); }
    }).catch(() => setMessage("Spotify authorization did not finish. Please try again."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!generated || !token) return;
    let cancelled = false;
    setMatching(true);
    matchTracks(token, tracks).then((found) => { if (!cancelled) setMatches(found); }).catch(() => { if (!cancelled) setToken(getStoredToken()); }).finally(() => { if (!cancelled) setMatching(false); });
    return () => { cancelled = true; };
  }, [generated, token, tracks]);

  const onFeelingChange = (text) => { setFeeling(text); reset(); const detected = detectMood(text); if (detected) setMood(detected); };
  const surprise = () => { const pick = moods.filter((item) => item.id !== mood); setMood(pick[Math.floor(Math.random() * pick.length)].id); setFeeling("surprise me with something beautiful"); reset(); };
  const pending = () => ({ moodId: mood, feeling, note });
  const onCreate = () => (token ? createPlaylist(token, pending()) : beginAuth(pending()));

  return <main className="app-shell"><header className="topbar"><div className="brand"><span className="brand-mark"><Heart size={16} fill="currentColor" /></span><span>Harswaggitify</span></div><span className="profile-chip" data-testid="profile-chip"><Heart size={14} fill="currentColor" /> {token ? "Spotify connected · made for Harshita" : "made for Harshita"}</span></header><section className="app-content"><div className="greeting"><p className="eyebrow">A playlist, made in your language <Sparkles size={14} /></p><h1>How is your heart<br /><em>singing</em> today?</h1><p>Choose a feeling. Add a little context. I’ll find the songs that get it.</p></div><div className="mood-grid">{moods.map((item, index) => <button data-testid={`mood-${item.id}-button`} key={item.id} style={{ "--i": index }} className={`mood-button ${mood === item.id ? "selected" : ""}`} onClick={() => { setMood(item.id); reset(); }}><span>{item.label}</span><small>{item.note}</small>{mood === item.id && <Check size={17} />}</button>)}</div><div className="feeling-row"><label htmlFor="feeling">Add a little more, if you want to</label><textarea data-testid="feeling-input" id="feeling" value={feeling} onChange={(event) => onFeelingChange(event.target.value)} placeholder="e.g. I want to feel like the city belongs to me..." /><button data-testid="surprise-me-button" className="surprise-button" onClick={surprise}><WandSparkles size={17} /> Surprise me</button></div><div className="action-row"><div><span className="selected-label">Selected feeling</span><strong data-testid="selected-mood-label">{selectedMood.label}</strong></div><button data-testid="make-playlist-button" className="primary-button" onClick={() => { setGenerated(true); setResult(null); setMessage(""); }}>Make my playlist <ArrowUpRight size={17} /></button></div>{generated && <PlaylistPreview key={mood} mood={selectedMood} tracks={tracks} matches={matches} matching={matching} connected={Boolean(token)} note={note} onNoteChange={setNote} onCreate={onCreate} busy={busy} message={message} result={result} />}</section></main>;
}
