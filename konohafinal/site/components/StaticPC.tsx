/** Ilustração 2D minimalista usada quando não há WebGL ou o usuário prefere menos movimento. */
export default function StaticPC() {
  return (
    <div className="flex h-full w-full items-center justify-center pb-[18vh]">
      <svg viewBox="0 0 320 360" className="h-[58vh] max-h-[560px] w-auto max-w-full" aria-hidden>
        <ellipse cx="160" cy="342" rx="140" ry="9" fill="#111" opacity=".08" />
        <rect x="20" y="10" width="280" height="320" rx="10" fill="#f4f3f1" stroke="#111" strokeWidth="2.5" />
        <rect x="34" y="24" width="252" height="292" rx="5" fill="#ffffff" stroke="#d6d3cf" />
        <rect x="48" y="38" width="160" height="186" rx="3" fill="#1c1c1c" />
        <rect x="92" y="64" width="40" height="40" rx="4" fill="#2b2b2b" stroke="#555" />
        <rect x="146" y="52" width="6" height="84" rx="2" fill="#3a3a3a" />
        <rect x="157" y="52" width="6" height="84" rx="2" fill="#3a3a3a" />
        <rect x="50" y="160" width="176" height="30" rx="4" fill="#111" />
        <rect x="50" y="186" width="176" height="2" fill="#ff6a13" />
        <rect x="34" y="246" width="252" height="70" fill="#e9e7e4" />
        {[70, 140, 210].map((y) => (
          <g key={y}>
            <circle cx="256" cy={y} r="22" fill="#fff" stroke="#111" strokeWidth="2" />
            <circle cx="256" cy={y} r="6" fill="#111" />
          </g>
        ))}
      </svg>
    </div>
  );
}
