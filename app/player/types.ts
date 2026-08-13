export type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  /** Seconds — shown before loadedmetadata fires. */
  duration: number;
  audioUrl: string;
  /** Hex color for the vinyl center label. */
  labelColor: string;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};
