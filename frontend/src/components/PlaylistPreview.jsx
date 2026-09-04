import { ArrowUpRight, Heart, LoaderCircle, Music2 } from "lucide-react";
import { searchUrl } from "@/lib/spotify";

export const PlaylistPreview = ({ mood, tracks, matches, matching, connected, note, onNoteChange, onCreate, busy, message, result }) => (
  <section className="playlist-preview" data-testid="playlist-preview">
    <div className="preview-heading">
      <div><p className="eyebrow">Your little soundtrack <Music2 size={14} /></p><h2 data-testid="preview-title">For Harshita · <em>{mood.label}</em></h2></div>
      <span className="track-count" data-testid="track-count">{tracks.length} songs</span>
    </div>
    <p className="preview-note" data-testid="artwork-hint">{connected ? (matching ? "Matching songs and fetching album covers from Spotify..." : "Matched on Spotify. Confirm once and a private playlist appears in your account.") : "Connect Spotify when you confirm and the real album covers will appear here."}</p>
    <div className="track-list">
      {tracks.map((track, index) => {
        const match = matches?.[index];
        return (
          <a data-testid={`track-${index + 1}-link`} className="track" style={{ "--i": index }} key={track.name} href={match?.url || searchUrl(track.query)} target="_blank" rel="noreferrer">
            <span className="track-number">{String(index + 1).padStart(2, "0")}</span>
            <span className={`cover-art ${matching ? "loading" : ""}`}>{match?.image ? <img data-testid={`track-${index + 1}-cover`} src={match.image} alt={`${track.album} cover`} /> : <Music2 size={18} />}</span>
            <span><strong>{track.name}</strong><small>{track.artist}</small></span>
            <span className="album-name">{track.album}</span>
            <ArrowUpRight size={15} className="track-arrow" />
          </a>
        );
      })}
    </div>
    <div className="love-note">
      <label htmlFor="love-note"><Heart size={12} fill="currentColor" /> A love note for the playlist description</label>
      <textarea data-testid="love-note-input" id="love-note" maxLength={220} value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="e.g. For the girl who makes every song sound better..." />
      <small data-testid="love-note-count">{note.length}/220</small>
    </div>
    <button data-testid="create-spotify-playlist-button" className="confirm-button" onClick={onCreate} disabled={busy || matching}>
      {busy ? <><LoaderCircle size={17} className="spin" /> {message || "Creating your playlist..."}</> : <>{connected ? "Create this playlist in Spotify" : "Connect Spotify & create playlist"} <ArrowUpRight size={17} /></>}
    </button>
    {message && !busy && <p data-testid="playlist-status-message" className="preview-note status">{message}</p>}
    {result && !busy && <a data-testid="open-playlist-link" className="created-link" href={result.url} target="_blank" rel="noreferrer">Open “{result.name}” in Spotify <ArrowUpRight size={15} /></a>}
  </section>
);
