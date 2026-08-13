// Fill these in with real profile URLs — an empty string simply omits that
// icon, so the row degrades gracefully until they're set.
const INSTAGRAM_URL = "";
const GITHUB_URL = "";

export function SocialLinks() {
  const links = [
    { url: INSTAGRAM_URL, label: "Instagram", icon: <InstagramIcon /> },
    { url: GITHUB_URL, label: "GitHub", icon: <GithubIcon /> },
  ].filter((link) => link.url.length > 0);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-3 text-white/70">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label}
          className="transition-colors hover:text-white"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-[18px] w-[18px]"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.3 6.84 9.65.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.01 10.01 0 0 0 22 12.19C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}
