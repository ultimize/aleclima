import React from "react";

interface LogoProps {
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ light }) => {
  const img = (
    <img
      src="/aleclima-logo.png"
      alt="Aleclima e Impianti"
      className="site-logo"
      width={922}
      height={473}
    />
  );
  return light ? <span className="site-logo-plate">{img}</span> : img;
};
