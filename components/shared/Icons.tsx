import React from "react";

interface IcoProps {
  d: React.ReactNode;
  c?: string;
  s?: number;
}

export const Ico: React.FC<IcoProps> = ({ d, c = "currentColor", s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

export const I = {
  phone: <Ico d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />} />,
  wa: <Ico d={<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.38 8.38 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5z" />} />,
  mail: <Ico d={<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>} />,
  pin: <Ico d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>} />,
  arrow: <Ico d={<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>} s={16} />,
  check: <Ico d={<path d="M20 6 9 17l-5-5" />} s={18} c="#16A34A" />,
  snow: <Ico d={<path d="M12 2v20M2 12h20m-3-7-14 14m0-14 14 14" />} c="#1668C7" />,
  sun: <Ico d={<><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>} c="#F4A933" />,
  flame: <Ico d={<path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 .5-2S6 9 6 13a6 6 0 0 0 12 0c0-5-6-11-6-11z" />} c="#E25822" />,
  drop: <Ico d={<path d="M12 2.7s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />} c="#1668C7" />,
  shield: <Ico d={<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></>} c="#16A34A" />,
  euro: <Ico d={<><path d="M18 7a6 6 0 1 0 0 10M4 10h7M4 14h7" /></>} c="#16A34A" />,
  bolt: <Ico d={<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />} c="#F4A933" />,
  tools: <Ico d={<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z" />} c="#1668C7" />,
};
