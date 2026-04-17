const phrases = [
  "Websites that load in under a second",
  "Migrations without the all-nighter",
  "Design that reads like a good email",
  "Hosting we can explain to your parents",
];

export function RunningLine() {
  return (
    <div className="running" aria-hidden="true">
      <div className="running-track">
        {[...phrases, ...phrases].map((phrase, i) => (
          <span key={i}>{phrase}</span>
        ))}
      </div>
    </div>
  );
}
