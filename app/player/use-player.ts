"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, nextTrackIndex, prevTrackIndex } from "./format";
import type { Playlist, Track } from "./types";

export type PlaybackStatus = "idle" | "playing" | "paused";

export type PlayerControls = {
  playPause: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  selectPlaylist: (playlistIndex: number) => void;
};

export type UsePlayerResult = {
  playlists: Playlist[];
  playlistIndex: number;
  trackIndex: number;
  currentPlaylist: Playlist;
  currentTrack: Track;
  status: PlaybackStatus;
  elapsed: number;
  duration: number;
  unavailable: boolean;
  controls: PlayerControls;
};

export function usePlayer(playlists: Playlist[]): UsePlayerResult {
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(() => playlists[0].tracks[0].duration);
  const [unavailable, setUnavailable] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const erroredUrlsRef = useRef<Set<string>>(new Set());

  // Stable ref so callbacks registered once at mount can read latest state.
  const stateRef = useRef({ playlistIndex, trackIndex, playlists });
  useEffect(() => {
    stateRef.current = { playlistIndex, trackIndex, playlists };
  }, [playlistIndex, trackIndex, playlists]);

  // Imperatively swap the audio source. Called from controls and from advance().
  const loadTrack = useCallback((track: Track, shouldPlay: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.audioUrl;
    audio.load();
    setElapsed(0);
    setDuration(track.duration);
    if (shouldPlay) {
      audio.play().catch(() => {});
    }
  }, []);

  const advance = useCallback(() => {
    const { playlists, playlistIndex, trackIndex } = stateRef.current;
    const tracks = playlists[playlistIndex].tracks;
    const nextIdx = nextTrackIndex(trackIndex, tracks.length);
    loadTrack(tracks[nextIdx], true);
    setTrackIndex(nextIdx);
  }, [loadTrack]);

  // Create the HTMLAudioElement exactly once.
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onPlaying = () => setStatus("playing");
    const onPause = () => setStatus("paused");
    const onEnded = () => advance();
    const onTimeUpdate = () => setElapsed(audio.currentTime);
    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onError = () => {
      const { playlists, playlistIndex, trackIndex } = stateRef.current;
      const track = playlists[playlistIndex].tracks[trackIndex];
      erroredUrlsRef.current.add(track.audioUrl);
      const allErrored = playlists[playlistIndex].tracks.every((t) =>
        erroredUrlsRef.current.has(t.audioUrl),
      );
      if (allErrored) {
        setUnavailable(true);
      } else {
        advance();
      }
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);

    // Preload metadata for the first track; don't autoplay (browser blocks it).
    const { playlists: pl, playlistIndex: pi, trackIndex: ti } = stateRef.current;
    const initialTrack = pl[pi].tracks[ti];
    audio.preload = "metadata";
    audio.src = initialTrack.audioUrl;

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [advance]);

  const playPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (status === "playing") {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [status]);

  const next = useCallback(() => {
    const { playlists, playlistIndex, trackIndex } = stateRef.current;
    const tracks = playlists[playlistIndex].tracks;
    const nextIdx = nextTrackIndex(trackIndex, tracks.length);
    const audio = audioRef.current;
    loadTrack(tracks[nextIdx], audio ? !audio.paused : false);
    setTrackIndex(nextIdx);
  }, [loadTrack]);

  const prev = useCallback(() => {
    const { playlists, playlistIndex, trackIndex } = stateRef.current;
    const tracks = playlists[playlistIndex].tracks;
    const prevIdx = prevTrackIndex(trackIndex, tracks.length);
    const audio = audioRef.current;
    loadTrack(tracks[prevIdx], audio ? !audio.paused : false);
    setTrackIndex(prevIdx);
  }, [loadTrack]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = clamp(seconds, 0, audio.duration || 0);
    audio.currentTime = target;
    setElapsed(target);
  }, []);

  const selectPlaylist = useCallback(
    (newPlaylistIndex: number) => {
      erroredUrlsRef.current = new Set();
      const { playlists } = stateRef.current;
      const firstTrack = playlists[newPlaylistIndex].tracks[0];
      const audio = audioRef.current;
      loadTrack(firstTrack, audio ? !audio.paused : false);
      setPlaylistIndex(newPlaylistIndex);
      setTrackIndex(0);
    },
    [loadTrack],
  );

  return {
    playlists,
    playlistIndex,
    trackIndex,
    currentPlaylist: playlists[playlistIndex],
    currentTrack: playlists[playlistIndex].tracks[trackIndex],
    status,
    elapsed,
    duration,
    unavailable,
    controls: { playPause, next, prev, seek, selectPlaylist },
  };
}
