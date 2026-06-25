/**
 * Channel Horizon Bank — inline SVG logo component.
 * Using an inline SVG avoids any image-file dependency and renders crisply at all sizes.
 */
const BankLogo = ({ size = 40, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    aria-label="Channel Horizon Bank logo"
    role="img"
  >
    <defs>
      <linearGradient id="chbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#100257" />
        <stop offset="100%" stopColor="#BA0D76" />
      </linearGradient>
    </defs>
    {/* Background circle */}
    <circle cx="50" cy="50" r="48" fill="url(#chbGrad)" />
    {/* Horizon line */}
    <line x1="18" y1="58" x2="82" y2="58" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    {/* Rising sun arc */}
    <path d="M50 54 A14 14 0 0 1 64 54" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Sun rays */}
    <line x1="50" y1="36" x2="50" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <line x1="60" y1="39" x2="63" y2="34" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <line x1="40" y1="39" x2="37" y2="34" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    {/* CHB label */}
    <text
      x="50"
      y="82"
      fontFamily="Arial, sans-serif"
      fontSize="13"
      fontWeight="700"
      fill="white"
      textAnchor="middle"
      letterSpacing="1"
    >
      CHB
    </text>
  </svg>
);

export default BankLogo;
