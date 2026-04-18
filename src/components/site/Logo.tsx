export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg
      className="mark"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="38" height="38" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 10 26 L 20 10 L 30 26 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="22" r="2.5" fill="var(--accent)" />
    </svg>
  );
}
