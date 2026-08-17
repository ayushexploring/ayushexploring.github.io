const paths = {
  mail: <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm1.5.5 7.5 5.2 7.5-5.2" />,
  github: (
    <path d="M9 19c-4 1.4-4-2.1-5.5-2.6M15 21v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 5.9-1.5 5.9-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.5-.4-4.5 1.7a11.6 11.6 0 0 0-6 0C5 .6 3.5 1 3.5 1a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 2 8c0 5 2.9 6.2 5.9 6.5a3.4 3.4 0 0 0-.9 2.6V21" />
  ),
  linkedin: (
    <>
      <path d="M4.5 9.5v10M4.5 5.2v.1M10 19.5v-6a3.5 3.5 0 0 1 7 0v6M10 9.5v10" />
    </>
  ),
  scholar: (
    <>
      <path d="M12 3 2 8.5l10 5.5 10-5.5L12 3Z" />
      <path d="M6 11v5.5c0 1.7 2.7 3 6 3s6-1.3 6-3V11" />
    </>
  ),
  orcid: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9v7M9 6.2v.1M13 16V9h1.8a3.5 3.5 0 0 1 0 7H13Z" />
    </>
  ),
  external: <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
  quote: <path d="M8 5H4v6h4l-2 8M20 5h-4v6h4l-2 8" />,
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.5 7 22l5-2.5L17 22l-1.5-7.5" />
    </>
  ),
  mic: <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />,
  cap: <path d="M2 8.5 12 4l10 4.5-10 4.5L2 8.5Zm4 3v5.2c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3V11.5M20 10v6" />,
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12.5h18" />
    </>
  ),
  users: <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 10.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.2a3.25 3.25 0 0 1 0 6.1" />,
  sun: <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m11.4 0 1.4 1.4M4.9 4.9l1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  pin: <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />,
  chart: <path d="M4 20h16M7 20v-6M12 20V6M17 20v-9" />,
  spark: <path d="M12 3v3.5M12 17.5V21M4.9 4.9l2.5 2.5M16.6 16.6l2.5 2.5M3 12h3.5M17.5 12H21M4.9 19.1l2.5-2.5M16.6 7.4l2.5-2.5" />,
}

export default function Icon({ name, className = 'size-5', ...rest }) {
  const d = paths[name]
  if (!d) return null

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {d}
    </svg>
  )
}
