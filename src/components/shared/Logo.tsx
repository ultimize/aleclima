import React from "react";

interface LogoProps {
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ light }) => (
  <div className="logo">
    <svg className="mark" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="23" fill={light ? "rgba(255,255,255,.1)" : "#F2F6FB"} />
      <circle cx="24" cy="19" r="6.5" fill="#F4A933" />
      <g stroke="#F4A933" strokeWidth="2" strokeLinecap="round">
        <path d="M24 7v3M24 28v3M11 19h3M34 19h3M15 10l2 2M31 10l-2 2" />
      </g>
      <path d="M6 33c5-4 9-4 12 0s11 4 12-1c1 4 6 4 12 1v6c-7 4-12 1-13-1-2 3-9 3-11-1-3 4-8 4-12 1z" fill="#1668C7" />
      <path d="M6 33c5-4 9-4 12 0s11 4 12-1c1 4 6 4 12 1" stroke="#0A2540" strokeWidth="0" />
    </svg>
    <div className="txt">
      <div className="wm">
        <span className="a" style={light ? { color: "#fff" } : {}}>ALE</span>
        <span className="b" style={light ? { color: "#7fb4ec" } : {}}>CLIMA</span>
      </div>
      <div className="sub" style={light ? { color: "#9fc0e6" } : {}}>e impianti</div>
    </div>
  </div>
);
