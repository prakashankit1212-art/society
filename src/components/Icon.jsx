const paths = {
  leaf: <><path d="M20 4C11 4 5 8 4 18c5-1 9-4 11-8"/><path d="M4 20c4-1 7-4 10-8"/></>,
  home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="M8 9h8M8 13h8M8 17h5"/></>,
  message: <><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5a3.5 3.5 0 0 1-3.5 3.5H11l-4.5 3v-3.2A3.5 3.5 0 0 1 5 11.5Z"/></>,
  users: <><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20"/><circle cx="10" cy="8" r="3.5"/><path d="M16 4.5a3.2 3.2 0 0 1 0 6.2M19.5 20v-1.2a3.4 3.4 0 0 0-2.5-3.3"/></>,
  user: <><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></>,
  logout: <><path d="M10 5H5v14h5"/><path d="m14 8 4 4-4 4"/><path d="M18 12H9"/></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
  building: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M2 21h20"/><path d="M8 7h4M8 11h4M8 15h4M8 19h4M18 9h2v12"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  eyeOff: <><path d="m3 3 18 18M10.6 6.1A10.8 10.8 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3.1 3.7M6.2 6.3C3.5 8.1 2 12 2 12s3.5 6 10 6c1 0 2-.2 2.9-.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.1.8-1.1 2-1.3-.5a8 8 0 0 1-1.5.9l-.2 1.4h-2.3l-.3-1.4a8 8 0 0 1-1.7-.1l-1 1-2-1.2.4-1.3a8 8 0 0 1-1-1.5l-1.4-.2v-2.3l1.4-.3a8 8 0 0 1 .1-1.7l-1-1 1.2-2 1.3.4a8 8 0 0 1 1.5-1l.2-1.4h2.3l.3 1.4a8 8 0 0 1 1.7.1l1-1 2 1.2-.4 1.3a8 8 0 0 1 1 1.5l1.4.2v2.3l-1.4.3a8 8 0 0 1-.1 1.7Z"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  back: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
  arrowLeft: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  wrench: <><path d="M14.7 6.3a4.2 4.2 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4.2 4.2 0 0 0 5.2-5.2L15 12l-3-3Z"/></>,
  clock: <><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></>,
  alert: <><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4M12 16h.01"/></>,
  droplet: <path d="M12 2s6 6.1 6 11a6 6 0 0 1-12 0c0-4.9 6-11 6-11Z"/>,
  zap: <path d="m13 2-8 11h6l-1 9 8-11h-6l1-9Z"/>,
  shield: <><path d="M12 3 19 6v5c0 4.7-2.9 8.1-7 10-4.1-1.9-7-5.3-7-10V6l7-3Z"/><path d="m9.2 12 1.8 1.8 3.8-4"/></>,
  car: <><path d="M5 16v-2l1.5-4.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 14v2"/><path d="M4 16h16v3H4z"/><circle cx="7" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16"/></>,
  filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,
  paperclip: <path d="m21.2 11.6-8.9 8.9a5 5 0 0 1-7.1-7.1l9.2-9.2a3.5 3.5 0 0 1 5 5l-9.3 9.3a2 2 0 1 1-2.8-2.8l8.8-8.8"/>,
  userPlus: <><circle cx="9" cy="8" r="3.4"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M17 8v6M14 11h6"/></>,
  megaphone: <><path d="m4 11 12-5v12L4 14z"/><path d="M16 10h2.5A2.5 2.5 0 0 1 21 12.5v0A2.5 2.5 0 0 1 18.5 15H16M6 15l1.5 5"/></>,
  chart: <><path d="M4 19V5M4 19h16"/><path d="m7 15 3-4 3 2 5-7"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  edit: <><path d="m4 16-.8 4 4-.8L18 8.4a2.1 2.1 0 0 0-3-3L4 16Z"/><path d="m13.7 6.3 4 4"/></>,
  download: <><path d="M12 3v11"/><path d="m7 10 5 5 5-5"/><path d="M4 20h16"/></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7l1-3h4l1 3"/></>,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.2"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.home}
    </svg>
  );
}
